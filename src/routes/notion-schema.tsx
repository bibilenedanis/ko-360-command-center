import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { fetchDatabaseSchema } from "@/lib/notion/queries.server";
import { getNotionConfig } from "@/lib/notion/config.server";

type SchemaProperty = {
  name: string;
  type: string;
  relationDatabaseId?: string;
};

type DatabaseSchema = {
  database: string;
  configured: boolean;
  properties: SchemaProperty[];
  error?: string;
};

const loadSchema = createServerFn({ method: "GET" }).handler(async () => {
  const config = getNotionConfig();

  const databases = [
    ["Goals", config.goalsDatabaseId],
    ["Sprints", config.sprintsDatabaseId],
    ["Sessions", config.sessionsDatabaseId],
    ["Assessments", config.assessmentsDatabaseId],
    ["Tasks", config.tasksDatabaseId],
    ["AI Recommendations", config.aiRecommendationsDatabaseId],
  ] as const;

  const results: DatabaseSchema[] = [];

  for (const [name, databaseId] of databases) {
    if (!databaseId) {
      results.push({
        database: name,
        configured: false,
        properties: [],
        error: "Database ID missing",
      });
      continue;
    }

    const result = await fetchDatabaseSchema(databaseId);

    if (!result.ok) {
      results.push({
        database: name,
        configured: true,
        properties: [],
        error: result.message,
      });
      continue;
    }

    const properties = Object.entries(result.data.properties).map(
      ([propertyName, value]) => {
        const property = value as {
          type?: string;
          relation?: {
            database_id?: string;
          };
        };

        return {
          name: propertyName,
          type: property.type ?? "unknown",
          relationDatabaseId: property.relation?.database_id,
        };
      },
    );

    results.push({
      database: name,
      configured: true,
      properties,
    });
  }

  return results;
});

export const Route = createFileRoute("/notion-schema")({
  loader: async () => await loadSchema(),
  component: NotionSchemaPage,
});

function NotionSchemaPage() {
  const schemas = Route.useLoaderData() as DatabaseSchema[];

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-2xl font-semibold">Notion Schema</h1>

        <p className="mb-8 text-sm text-muted-foreground">
          Temporary diagnostic view. No token or secret values are shown.
        </p>

        <div className="space-y-8">
          {schemas.map((schema) => (
            <section
              key={schema.database}
              className="rounded border border-outline-variant p-6"
            >
              <h2 className="mb-4 text-lg font-semibold">
                {schema.database}
              </h2>

              {schema.error ? (
                <p className="text-sm text-red-600">{schema.error}</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="py-2 pr-4">Property</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2">Relation Database</th>
                    </tr>
                  </thead>

                  <tbody>
                    {schema.properties.map((property) => (
                      <tr
                        key={property.name}
                        className="border-b border-outline-variant"
                      >
                        <td className="py-2 pr-4 font-mono">
                          {property.name}
                        </td>
                        <td className="py-2 pr-4 font-mono">
                          {property.type}
                        </td>
                        <td className="py-2 font-mono text-xs">
                          {property.relationDatabaseId ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
