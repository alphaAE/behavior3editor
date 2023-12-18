export namespace Behavior3 {
export const monster = {
  "name": "monster",
  "root": {
    "id": 1,
    "name": "Sequence",
    "desc": "怪物测试AI",
    "args": {},
    "children": [
      {
        "id": 2,
        "name": "Sequence",
        "desc": "攻击",
        "args": {},
        "children": [
          {
            "id": 3,
            "name": "GetHp",
            "args": {},
            "output": [
              "hp1"
            ]
          },
          {
            "id": 4,
            "name": "Cmp",
            "args": {
              "gt": 50
            },
            "input": [
              "hp"
            ]
          },
          {
            "id": 5,
            "name": "Log",
            "desc": "攻击",
            "args": {
              "str": "Attack!"
            }
          }
        ]
      },
      {
        "id": 6,
        "name": "Log",
        "desc": "逃跑",
        "args": {
          "str": "Run!"
        }
      }
    ]
  },
  "desc": "怪物测试AI"
}
}