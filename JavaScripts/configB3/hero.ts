export const Behavior3_hero = {
  "name": "hero",
  "root": {
    "id": 1,
    "name": "Selector",
    "desc": "英雄测试AI",
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
            "name": "FindEnemy",
            "args": {
              "x": 0,
              "y": 0,
              "w": 1000,
              "h": 50
            },
            "output": [
              "enemy"
            ]
          },
          {
            "id": 4,
            "name": "Attack",
            "args": {},
            "input": [
              "enemy"
            ]
          },
          {
            "id": 5,
            "name": "Wait",
            "args": {
              "time": 10
            }
          }
        ]
      },
      {
        "id": 6,
        "name": "Sequence",
        "desc": "移动",
        "args": {},
        "children": [
          {
            "id": 7,
            "name": "FindEnemy",
            "args": {
              "w": 1000,
              "h": 500,
              "x": 2,
              "y": 3
            },
            "output": [
              "enemy"
            ]
          },
          {
            "id": 8,
            "name": "MoveToTarget",
            "args": {},
            "input": [
              "enemy"
            ]
          }
        ]
      },
      {
        "id": 9,
        "name": "Sequence",
        "desc": "逃跑",
        "args": {},
        "children": [
          {
            "id": 10,
            "name": "GetHp",
            "args": {},
            "output": [
              "hp"
            ]
          },
          {
            "id": 11,
            "name": "Cmp",
            "args": {
              "lt": 50
            },
            "input": [
              "hp"
            ]
          },
          {
            "id": 12,
            "name": "MoveToPos",
            "args": {
              "x": 0,
              "y": 0
            }
          }
        ]
      },
      {
        "id": 13,
        "name": "Idle"
      }
    ]
  },
  "desc": "英雄测试AI"
}