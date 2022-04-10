"""Adding jobs table

Revision ID: 47de8a4a8697
Revises: ba26fc3cd454
Create Date: 2022-04-10 09:39:27.367805

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '47de8a4a8697'
down_revision = 'ba26fc3cd454'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('jobs',
    sa.Column('job_id', sa.Integer(), nullable=False),
    sa.Column('job_title', sa.String(length=52), nullable=False),
    sa.Column('min_salary', sa.Integer(), nullable=False),
    sa.Column('max_salary', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('job_id')
    )
    op.create_index(op.f('ix_jobs_job_id'), 'jobs', ['job_id'], unique=False)
    op.create_index(op.f('ix_jobs_job_title'), 'jobs', ['job_title'], unique=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_jobs_job_title'), table_name='jobs')
    op.drop_index(op.f('ix_jobs_job_id'), table_name='jobs')
    op.drop_table('jobs')
    # ### end Alembic commands ###
