"""
现有两个数组，其中一个为[an]，元素数量为n-1个，元素为浮点数，另一个为[bn]，元素数量为n个，元素仅包含1和2。现在按以下步骤处理
1、在an末尾加上一个元素0，这样an与bn包含元素数量相同，通过下标一一对应。
2、从an的第一个元素开始，按下标顺序寻找小于15/240 * 1000的值。
3、若找到了符合条件的值（记为T），记录当前下标（假设为i），继续向后遍历，直到元素值与T不同为止。假设找到不同值时的下标为i+N，这意味着T连续出现了N次。
4、若500/T≤16/(N+2)+8或N=1，回到步骤2，从下标为i+N开始继续按下标顺序寻找，否则继续往下进行步骤。
5、提取bn中，下标范围为i至i+N，共计N+1个元素并按原先的相对顺序作为子集，并从该子集的第一个元素开始观察：
(1)若下一个元素与自身相同，从子集中删除下一个元素，后面的元素往前移位，然后将观察对象移至下一个元素
(2)若下一个元素与自身不同，不做改动，观察对象移至下一个元素
如此循环，直至观察对象到子集末尾时终止，记此时的子集包含元素数量为L，计算系数C1：
(1)若N+1为奇数，C1=((L-1)/N-0.5)*2
(2)若N+1为偶数，C1=((L/(N+1)-0.5)*2
计算使得500/T=16/(N+2)+8的T值记为T0，使得500/T=16/(N+2)+9的T值记为Tm，系数C2=min((1/T-1/T0)/(1/Tm-1/T0),1)
计算系数C=C1*C2，记录下步骤中用到的值i，N，C（定义为：从下标i开始，长度为N，系数为C的简化处理，在后面的步骤中进行，代码中可用roll表示），并回到步骤2，若N是偶数，从下标为i+N开始继续按下标顺序寻找，若N是奇数，从下标为i+N+1开始。
6、前面的步骤结束后，若得到了若干组(i,N,C)，将其中所有出现的C值从大到小排列（记为C1,C2,...Cm），首先将所有C≥C1的(i,N,C)对于原数组an,bn进行简化处理，并记录下处理后的数组an，数组bn以及C1，然后将所有C≥C2的(i,N,C)对于原数组an,bn进行简化处理，并记录下处理后的数组an，数组bn以及C2……以此类推，最后将所有C≥Cm的(i,N,C)对于原数组an,bn进行简化处理，并记录下处理后的数组an，数组bn以及Cm。
最后，返回每一组处理过后的an,bn,C（an需要删除最后一个元素再输出）。若没有得到任何一组(i,N,C)则返回空值，代表an与bn不需要进行简化处理。

对于原数组an,bn，参数为i,N,C的简化处理的具体步骤：
对于数组an，从下标为i开始到下标为i+N-1为止，所有下标为i+偶数（0,2,4……）的值加上下一个下标的值，之后从下标为i开始到下标为i+N为止，删除所有下标为i+奇数（1,3,5,……）的值
对于数组bn，从下标为i开始到下标为i+N为止，删除所有下标为i+奇数（1,3,5,……）的值
注意：这里的下标i指原数组中的下标而非在删除元素之后的数组下标，为了避免因删除元素导致的下标移位带来混乱，当同时进行多组简化处理时，不妨按照i从大到小的顺序开始处理。
"""

def process(an, bn):
    # 步骤1：在an末尾补0
    an = an + [0.0]
    n = len(an)
    i = 0
    rules = []
    
    # 步骤2-5：遍历寻找规则
    while i < n:
        # 步骤2：寻找小于62.5的值
        if an[i] >= 62.5:
            i += 1
            continue
        
        # 步骤3：找到T，计算连续次数N
        T = an[i]
        N = 1
        while i + N < n and an[i + N] == T:
            N += 1
        
        # 步骤4：判断是否跳过
        if N == 1 or 500/T <= 16/(N+2) + 8:
            i = i + N
            continue
        
        # 步骤5：处理bn子集计算C
        sub = bn[i:i + N + 1].copy()  # 提取子集
        # 相邻相同删除逻辑
        idx = 0
        while idx < len(sub) - 1:
            if sub[idx] == sub[idx + 1]:
                del sub[idx + 1]  # 删除下一个元素
            idx += 1  # 观察对象移至下一个元素
        L = len(sub)
        
        # 计算C1
        if (N + 1) % 2 == 1:  # 奇数
            C1 = ((L - 1) / N - 0.5) * 2
        else:  # 偶数
            C1 = (L / (N + 1) - 0.5) * 2
        
        # 计算C2
        T0 = 500 / (16/(N+2) + 8)
        Tm = 500 / (16/(N+2) + 9)
        C2 = min((1/T - 1/T0) / (1/Tm - 1/T0), 1.0)
        C = C1 * C2
        
        rules.append((i, N, C))
        
        # 根据N的奇偶性决定下一步的起始下标
        if N % 2 == 0:  # N是偶数
            i = i + N
        else:  # N是奇数
            i = i + N + 1
    
    # 如果没有找到规则
    if not rules:
        return []
    
    # 步骤6：按C值从大到小排序并处理
    rules_sorted = sorted(rules, key=lambda x: x[2], reverse=True)
    C_vals = sorted(set(r[2] for r in rules_sorted), reverse=True)
    
    results = []
    for Ck in C_vals:
        # 筛选C≥Ck的规则并按i从大到小排序
        selected_rules = [r for r in rules_sorted if r[2] >= Ck]
        selected_rules.sort(key=lambda x: x[0], reverse=True)
        
        # 对原数组进行简化处理
        an_new = an[:]
        bn_new = bn[:]
        
        for i, N, _ in selected_rules:
            # 简化处理an：偶数下标加下一个值
            for k in range(0, N, 2):
                an_new[i + k] += an_new[i + k + 1]
            
            # 删除an中奇数下标
            del_indices_an = [i + odd for odd in range(1, N + 2, 2) 
                            if i + odd < len(an_new)]
            for idx in sorted(del_indices_an, reverse=True):
                del an_new[idx]
            
            # 删除bn中奇数下标
            del_indices_bn = [i + odd for odd in range(1, N + 2, 2) 
                            if i + odd < len(bn_new)]
            for idx in sorted(del_indices_bn, reverse=True):
                del bn_new[idx]
        
        # 删除an末尾补的0，恢复原始长度格式
        if len(an_new) > 0:
            an_new.pop()  # 删除最后一个元素（步骤1中补的0）
        
        results.append((an_new.copy(), bn_new.copy(), Ck))
    
    return results


def compute_roll_equivalent_difficulty(intervals):
    """
    计算滚奏等效难度
    
    参数:
    intervals: 音符间隔数组
    
    返回:
    (总难度, 难占比) 元组
    """
    if not intervals or len(intervals) == 0:
        return (0, 0)
    
    # 构造an和bn数组
    an = intervals.copy()
    bn = []
    for i in range(len(intervals) + 1):
        bn.append(1 if i % 2 == 0 else 2)
    
    try:
        # 调用process函数获取简化结果
        results = process(an, bn)
        
        if not results:
            return (0, 0)
        
        # 计算所有简化结果中的最大难度
        max_difficulty = 0
        for an_simplified, bn_simplified, coefficient in results:
            if an_simplified:
                # 根据系数和简化后的数据计算难度
                avg_interval = sum(an_simplified) / len(an_simplified) if an_simplified else 0
                difficulty = avg_interval * coefficient if avg_interval > 0 else 0
                max_difficulty = max(max_difficulty, difficulty)
        
        # 难占比为简化处理的最高系数
        ratio = max(r[2] for r in results) if results else 0
        
        return (max_difficulty, ratio)
    except Exception:
        return (0, 0)