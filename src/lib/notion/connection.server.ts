import { createNotionClient, isNotionClientError, APIResponseError } from "./client.server";
import { getNotionConfig } from "./config.server";

export type DatabaseStatus = "connected" | "disconnected" | "misconfigured" | "forbidden";
export interface NotionConnectionReport { configured:boolean; studentsDatabase:DatabaseStatus; tasksDatabase:DatabaseStatus; aiRecommendationsDatabase:DatabaseStatus }
function emptyReport():NotionConnectionReport { return {configured:false,studentsDatabase:"misconfigured",tasksDatabase:"misconfigured",aiRecommendationsDatabase:"misconfigured"}; }
async function probeDatabase(databaseId:string|undefined):Promise<DatabaseStatus>{
  if(!databaseId)return "misconfigured";
  const c=createNotionClient(); if(!c.ok)return "disconnected";
  try{
    const db=await c.client.databases.retrieve({database_id:databaseId});
    const ds="data_sources" in db ? db.data_sources?.[0]?.id : undefined;
    if(!ds)return "disconnected";
    await c.client.dataSources.query({data_source_id:ds,page_size:1});
    return "connected";
  }catch(error){
    if(isNotionClientError(error)&&error instanceof APIResponseError){ if(error.status===401||error.status===403)return "forbidden"; }
    console.error("[notion] probeDatabase failed:",error); return "disconnected";
  }
}
export async function testNotionConnection():Promise<NotionConnectionReport>{
  const token=process.env.NOTION_TOKEN;
  if(!(typeof token==="string"&&token.length>0&&!token.includes("PLACEHOLDER")))return emptyReport();
  const cfg=getNotionConfig();
  const [students,tasks,ai]=await Promise.all([probeDatabase(cfg.studentsDatabaseId),probeDatabase(cfg.tasksDatabaseId),probeDatabase(cfg.aiRecommendationsDatabaseId)]);
  return {configured:true,studentsDatabase:students,tasksDatabase:tasks,aiRecommendationsDatabase:ai};
}
