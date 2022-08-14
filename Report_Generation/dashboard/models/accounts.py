from django.db import models

# Create your models here.
class Account(models.Model):
    acc_number=models.CharField(max_length=20,db_column="AccountNumber")
    acc_type=models.CharField(max_length=20,db_column="AccountType")
    acc_num_vir=models.CharField(max_length=20,db_column="AcctNum_Virtual")
    cot_pay_gl=models.FloatField(db_column="COT_Pay_GL")
    cot_pay_jlg=models.FloatField(db_column="COT_Pay_JLG")
    cot_limit=models.FloatField(db_column="COTLimit")
    date_closure=models.DateField(db_column="Date_Closure")
    date_firstInstallment=models.DateField(db_column="Date_FirstInstalment")
    date_preclosure=models.DateField(db_column="Date_Preclosure")
    date_of_opening=models.DateField(db_column="DateOfOpening")
    emi=models.FloatField(db_column="EMI")
    emi_first=models.FloatField(db_column="EMI_FirstInst")
    gl_pay_jlg=models.FloatField(db_column="GL_Pay_JLG")
    gold_appraisal_fee=models.FloatField(db_column="GoldAppraisalFee")
    ifsc_virtual=models.CharField(max_length=20,db_column="IFSC_Virtual")
    insurance_deduction=models.FloatField(db_column="InsuranceDeduction")
    interest_firstMonth=models.FloatField(db_column="Interest_FirstMonth")
    interest_rate=models.FloatField(db_column="InterestRate")
    jlg_cash=models.FloatField(db_column="JLG_Cash_Withdrawal")
    loan_amount=models.FloatField(db_column="LoanAmount")
    lpf=models.FloatField(db_column="LPF")
    mem_memtype=models.TextField(db_column="Mem_MemType")
    mem_pay_gl=models.FloatField(db_column="Mem_Pay_GL")
    mem_pay_jlg=models.FloatField(db_column="Mem_Pay_JLG")
    mem_num=models.CharField(max_length=10,db_column="MemNum")
    retrieval_loan=models.FloatField(db_column="RetrievalLoan")
    rule=models.TextField(db_column="Rule")
    share_purchase=models.FloatField(db_column="SharePurchase")
    ssa_pay_gl=models.FloatField(db_column="SSA_Pay_GL")
    ssa_pay_jlg=models.FloatField(db_column="SSA_Pay_JLG")
    tenure=models.IntegerField(db_column="Tenure")
    vcmType=models.TextField(db_column="VCMType")

    class Meta():
        db_table="newdb_account"