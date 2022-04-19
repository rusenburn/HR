from pydantic import BaseModel, ValidationError ,validator,Field

class JobUpdate(BaseModel):
    job_id:int = Field(...,alias="jobId")
    job_title:str = Field(...,max_length=52,alias="jobTitle")
    min_salary : int = Field(...,ge=0,alias="minSalary")
    max_salary : int = Field(...,alias="maxSalary")

    
    class Config:
        allow_population_by_field_name=True
        
    @validator('max_salary')
    def max_salary_not_smaller_than_min_salary(cls,v:int,values:dict,**kwargs):
        if 'min_salary' in values and v < values['min_salary']:
            raise ValueError('max_salary must be bigger than min_salary')
        return v