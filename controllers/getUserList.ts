var fn_getUserList = async (req: any, res: any, next: Function) => {

    console.log('-------------getUserList Controller is comming!!!');
    let result = [{
            id: 1,
            'riyouJigyosyaCode': 'A1000001',
            'sei': '唐11',
            'mei': 'm1',
            'seiKana': '国强',
            'meiKana': 'カナ1',
            'seinengappi': '19900512',
            'seibetsu': '男',
            'riyousyaMailAddress': 'XX路XX号',
            'soshikiCode': 'code001',
            'syokusyuId': 'syo10001',
            'yakusyokuId': 'yaku200001'
        },
        {
            id: 2,
            'riyouJigyosyaCode': 'A1000002',
            'sei': '唐12',
            'mei': 'm2',
            'seiKana': '国强',
            'meiKana': 'カナ2',
            'seinengappi': '19911112',
            'seibetsu': '男',
            'riyousyaMailAddress': 'XX路XX号',
            'soshikiCode': 'code002',
            'syokusyuId': 'syo10002',
            'yakusyokuId': 'yaku200002'
        }
    ]

    return result;
};

module.exports = {
    'POST /api/user/findByConditions': fn_getUserList
};
