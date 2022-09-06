import json
from logging.handlers import MemoryHandler
from re import M
from statistics import mode
import sys
from django.shortcuts import render
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
from django.db.models.query import QuerySet

from dashboard.models.account_state import Account_State
from dashboard.models.transaction import Transaction
from dashboard.models.account_state import Account_State
from dashboard.models.user import User
from dashboard.models.accounts import Account
from datetime import date

# Create your views here.


def home(request):
    return render(request, 'index.html')

def filter_transactions(acc_num,acc_state_date : date, transactions):
    
    filtered_transaction = [transaction for transaction in transactions if (acc_state_date.month == transaction['date'].month and acc_state_date.year == transaction['date'].year and acc_num==transaction['acc_num'] )]
    
    return filtered_transaction



@csrf_exempt
def fetch_accounts_transaction(request):
    try:
        data = json.loads(request.body)
        member_id = data['member_id']
        acc_state = Account_State.objects.filter(
            mem_num=member_id).order_by('date_of_update')
        transaction = Transaction.objects.filter(mem_num=member_id).order_by('date')
    
        acc_state_list = acc_state.values()
        transaction_list = transaction.values()
        distinct_acc = list(set([acc['account_number'] for acc in acc_state_list]))
        
        data = {acc: 
            {"data": 
                {
                    str(ele['date_of_update']): 
                        [ele, filter_transactions(
                          acc,  ele['date_of_update'], transaction_list)]
                for ele in acc_state_list if ele['account_number']==acc
            
            
        }} for acc in distinct_acc}
        
        
        
        # Transaction

        return JsonResponse({"status_code":0, "data":data})
    except:
        err_type, value, traceback = sys.exc_info()
        print('{0} at line {1} in {2}'.format(str(value), str(
            traceback.tb_lineno), str(traceback.tb_frame.f_code.co_filename)))
        return JsonResponse({"status_code": -1, "message": "Something went wrong"}, status=500)

        

@csrf_exempt
def fetch_user_details(request):
    try:
        data = json.loads(request.body)
        member = data['member_id']
        user = User.objects.get(
            mem_num=member)
        if(user is None):
            return JsonResponse({"status_code": 1}, status=200)

        user = serialize('python', [user])

        return JsonResponse({"status_code": 0, "user": user}, status=200)
    except User.DoesNotExist as ex:
        return JsonResponse({"status_code": 1}, status=200)

    except Exception as ex:
        err_type, value, traceback = sys.exc_info()
        print('{0} at line {1} in {2}'.format(str(value), str(
            traceback.tb_lineno), str(traceback.tb_frame.f_code.co_filename)))
        return JsonResponse({"status_code": -1, "message": "Something went wrong"}, status=500)


@csrf_exempt
def fetch_acc_state(request):
    try:
        data = json.loads(request.body)
        member = data['member_id']
        acc_state = Account_State.objects.filter(
            mem_num=member).order_by('date_of_update')

        if(acc_state is None):
            return JsonResponse({"status_code": 1}, status=200)

        acc_state = serialize('python', acc_state)

        return JsonResponse({"status_code": 0, "acc_state": acc_state}, status=200)
    except Exception as ex:
        err_type, value, traceback = sys.exc_info()
        print('{0} at line {1} in {2}'.format(str(value), str(
            traceback.tb_lineno), str(traceback.tb_frame.f_code.co_filename)))
        return JsonResponse({"status_code": -1, "message": "Something went wrong"}, status=500)


@csrf_exempt
def fetch_transactions(request):
    try:
        data = json.loads(request.body)
        member = data['member_id']
        transactions = Transaction.objects.filter(
            mem_num=member).order_by("date")

        if(transactions is None):
            return JsonResponse({"status_code": 1}, status=200)

        transactions = serialize('python', transactions)

        return JsonResponse({"status_code": 0, "transactions": transactions}, status=200)
    except Exception as ex:
        err_type, value, traceback = sys.exc_info()
        print('{0} at line {1} in {2}'.format(str(value), str(
            traceback.tb_lineno), str(traceback.tb_frame.f_code.co_filename)))
        return JsonResponse({"status_code": -1, "message": "Something went wrong"}, status=500)


@csrf_exempt
def fetch_accounts(request):
    try:
        data = json.loads(request.body)
        member = data['member_id']
        acc = Account.objects.filter(
            mem_num=member)
        print(acc)
        if(acc is None):
            return JsonResponse({"status_code": 1}, status=200)

        acc = serialize('python', acc)

        return JsonResponse({"status_code": 0, "acc": acc}, status=200)
    except Exception as ex:
        err_type, value, traceback = sys.exc_info()
        print('{0} at line {1} in {2}'.format(str(value), str(
            traceback.tb_lineno), str(traceback.tb_frame.f_code.co_filename)))
        return JsonResponse({"status_code": -1, "message": "Something went wrong"}, status=500)
