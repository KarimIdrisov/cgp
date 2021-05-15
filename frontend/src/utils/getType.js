const types = {
    'impulse': 'Задержанный единичный импульс',
    'jump': 'Задержанный единичный скачок',
    'exponent': 'Дискретизированная убывающая экспонента',
    'sin': 'Дискретизированная синусоида',
    'meandr': "'Меандр'",
    'pila': "'Пила'",
    'exp_ogub': 'Сигнал с экспоненциальной огибающей',
    'balance_ogib': 'Сигнал с балансной огибающей',
    'tonal_ogib': 'Сигнал с тональной огибающей',
    'linear_module': 'Сигнал с линейной частотной модуляцией',
    'whiteEqual': 'Сигнал белого шума (равномерный)',
    'whiteLaw': 'Сигнал белого шума (нормальный)',
    'regression': 'Случайный сигнал авторегрессии',
}

export default function getType(id) {
    return types[id]
}
