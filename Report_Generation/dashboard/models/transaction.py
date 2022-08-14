from django.db import models
class Transaction(models.Model):
    acc_num=models.CharField(max_length=20,db_column="AccountNumber")
    amount=models.FloatField(db_column="Amount")
    collect_id=models.IntegerField(db_column="collectionId")
    crdr=models.CharField(max_length=2,db_column="CRDR")
    date=models.DateField(db_column="Date")
    id=models.PositiveBigIntegerField(primary_key=True,db_column="id")
    mem_num=models.CharField(max_length=10,db_column="MemNum")
    narration=models.TextField(db_column="Narration")
    rule=models.TextField(db_column="Rule")
    status=models.IntegerField(db_column="status")
    transaction_type=models.TextField(db_column="TransactionType")
    trans_type_name=models.TextField(db_column="TransTypeName")


    class Meta():
        db_table="newdb_transaction"