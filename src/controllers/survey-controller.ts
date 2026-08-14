
import { db } from "../db/index.js";
import { surveyZodSchema } from "../zod/survey-zod-schema.js";
import { surveysTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

function generateToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function create (req: Request, res: Response){

    const validation = surveyZodSchema.safeParse(req.body);

    if(!validation.success){
        return res.status(400).json({ success:false, message: 'All fields are mandatory' });
    }

     const { name, phone_number, company_name, designation } = validation.data;
   
     let token = generateToken();
     const existing = await db.select().from(surveysTable).where(eq(surveysTable.token, token));
     
     if (existing.length > 0) {
       return res.status(500).json({success: false, message: 'Token collision, please try again' });
     }
   
     const [result] = await db.insert(surveysTable).values({ 
       name, 
       phone_number, 
       company_name, 
       designation, 
       token 
     });
   
   const insertId = result.insertId;
   
   const [newRecord] = await db.select()
     .from(surveysTable)
     .where(eq(surveysTable.id, insertId));
   
   res.status(201).json({ 
     success: true,
     data: newRecord, 
     message: "Survey Submitted Successfully" 
   }); 
}

async function getSurveyReport(req: Request, res: Response) {
  try {

    const [rows] = await db.execute('CALL GetSurveyReport()');

    return res.status(200).json({
      success: true,
      data: rows,
      message: 'Survey report generated successfully using stored procedure',
    });
  } catch (error) {
    console.error('Error generating survey report:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

export const surveyController ={create, getSurveyReport}