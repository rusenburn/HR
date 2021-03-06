"""Adding Departments Table

Revision ID: ba26fc3cd454
Revises: 4957e73d433e
Create Date: 2022-04-09 09:57:38.673513

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ba26fc3cd454'
down_revision = '4957e73d433e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('departments',
    sa.Column('department_id', sa.Integer(), nullable=False),
    sa.Column('department_name', sa.String(length=52), nullable=False),
    sa.Column('location_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['location_id'], ['locations.location_id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('department_id'),
    sa.UniqueConstraint('department_name')
    )
    op.create_index(op.f('ix_departments_department_id'), 'departments', ['department_id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_departments_department_id'), table_name='departments')
    op.drop_table('departments')
    # ### end Alembic commands ###
