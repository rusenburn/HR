from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from ..database import Base
from sqlalchemy.orm import relationship


class Job(Base):
    __tablename__ = "jobs"

    job_id: int = Column(Integer, primary_key=True, index=True)
    job_title: str = Column(String(52), index=True,
                            unique=True, nullable=False)
    min_salary: int = Column(Integer, nullable=False)
    max_salary: int = Column(Integer, nullable=False)

    # employees = relationship("Employee", back_populates = "job")
    # job_histories = relationship("JobHistory" , back_populates="job")
