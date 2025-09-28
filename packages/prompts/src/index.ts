import { z } from 'zod';

// AI Prompt Templates
export const PromptTemplates = {
  PATIENT_INTAKE_ANALYSIS: `
Analyze the following patient intake information and provide structured insights:

Patient Information:
{patientInfo}

Please provide:
1. Risk assessment summary
2. Recommended therapy approaches
3. Priority areas for intervention
4. Family engagement strategies
5. Timeline recommendations

Format your response as structured JSON with clear sections.
`,

  BEHAVIOR_PLAN_GENERATION: `
Generate a comprehensive behavior intervention plan based on:

Assessment Data:
{assessmentData}

Target Behaviors:
{targetBehaviors}

Please create:
1. Functional behavior assessment summary
2. Replacement behavior strategies
3. Environmental modifications
4. Data collection procedures
5. Progress monitoring guidelines
`,

  THERAPY_SESSION_NOTES: `
Generate structured therapy session notes based on:

Session Details:
{sessionDetails}

Activities Completed:
{activities}

Observations:
{observations}

Please provide:
1. Session summary
2. Goal progress analysis
3. Behavior observations
4. Recommendations for next session
5. Family/caregiver notes
`,

  INSURANCE_DOCUMENTATION: `
Create professional insurance documentation for:

Patient: {patientName}
Service Dates: {serviceDates}
Services Provided: {services}
Clinical Justification: {justification}

Generate:
1. Prior authorization request
2. Progress report summary
3. Medical necessity documentation
4. Treatment plan updates
5. Outcome measurements
`
};

export type PromptTemplate = keyof typeof PromptTemplates;

// Prompt Builder Class
export class PromptBuilder {
  private template: string;
  private variables: Record<string, string> = {};

  constructor(template: PromptTemplate | string) {
    this.template = typeof template === 'string' ? template : PromptTemplates[template];
  }

  setVariable(key: string, value: string): PromptBuilder {
    this.variables[key] = value;
    return this;
  }

  setVariables(variables: Record<string, string>): PromptBuilder {
    this.variables = { ...this.variables, ...variables };
    return this;
  }

  build(): string {
    let result = this.template;
    
    Object.entries(this.variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });

    return result;
  }

  reset(): PromptBuilder {
    this.variables = {};
    return this;
  }
}

// Validation schemas for prompt inputs
export const PatientInfoSchema = z.object({
  name: z.string(),
  age: z.number(),
  diagnosis: z.string(),
  concerns: z.array(z.string()),
  goals: z.array(z.string()),
});

export const AssessmentDataSchema = z.object({
  functionalAssessment: z.string(),
  environmentalFactors: z.array(z.string()),
  triggerEvents: z.array(z.string()),
  currentInterventions: z.array(z.string()),
});

export const SessionDetailsSchema = z.object({
  date: z.string(),
  duration: z.number(),
  therapist: z.string(),
  setting: z.string(),
  participants: z.array(z.string()),
});

export type PatientInfo = z.infer<typeof PatientInfoSchema>;
export type AssessmentData = z.infer<typeof AssessmentDataSchema>;
export type SessionDetails = z.infer<typeof SessionDetailsSchema>;