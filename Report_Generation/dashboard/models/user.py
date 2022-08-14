from django.db import models
class User(models.Model):

    address=models.TextField(db_column="Address")
    branch_code=models.TextField(db_column="BranchCode")
    branch_name=models.TextField(db_column="BranchName")
    center=models.TextField(db_column="Center")
    center_id=models.CharField(max_length=255,db_column="CenterID")
    center_name=models.TextField(db_column="CenterName")
    center_num=models.CharField(max_length=255,db_column="CenterNum")
    community=models.TextField(db_column="Community")
    DateSignup=models.TextField(db_column="DateSignup")
    employee_code=models.TextField(db_column="EmployeeCode")
    field_office=models.TextField(db_column="FieldOfficer")
    group_name=models.TextField(db_column="GroupName")
    group_num=models.TextField(db_column="GroupNum")
    member_type=models.CharField(max_length=10,db_column="memberType")
    mem_id=models.TextField(db_column="MemID",primary_key=True)
    mem_name=models.TextField(db_column="MemName")
    mem_num=models.CharField(max_length=100,db_column="MemNum")
    mobile=models.TextField(db_column="Mobile_WhatsApp")
    r001=models.CharField(max_length=4,db_column="R001")
    reg_mobile=models.TextField(db_column="RegMobile")
    role=models.CharField(max_length=10,db_column="Role")
    rule=models.CharField(max_length=255,db_column="Rule")
    whatsapp_mobile=models.CharField(max_length=255,db_column="WhatsAppMobile")

    class Meta():
        db_table="newdb_user"