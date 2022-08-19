import json
import sys
from django.shortcuts import render
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize

from dashboard.models.transaction import Transaction

# Create your views here.


def home(request):
    return render(request, 'index.html')

@csrf_exempt
def fetch_transactions(request):
    try:
        data = json.loads(request.body)
        member = data['member_id']
        transactions = Transaction.objects.filter(mem_num=member)
        if(transactions is None):
            return JsonResponse({"status_code":1}, status=200)
        
        transactions = serialize('python', transactions)
        return JsonResponse({"status_code":0, "data":transactions}, status=200)
    except Exception as ex:
        err_type, value, traceback = sys.exc_info()
        print('{0} at line {1} in {2}'.format(str(value), str(
            traceback.tb_lineno), str(traceback.tb_frame.f_code.co_filename)))
        return JsonResponse({"status_code":-1, "message":"Something went wrong"}, status=500)
