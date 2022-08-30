import json
import sys
from django.shortcuts import render
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize

from dashboard.models.account_state import Account_State
from dashboard.models.transaction import Transaction
from dashboard.models.account_state import Account_State
from dashboard.models.user import User
from dashboard.models.accounts import Account

# Create your views here.


def home(request):
    return render(request, 'index.html')


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
