code = `
@type
font.bitmap
    size int int
    ch int int
    spacing int int

@font.bitmap
player/songtickerfont.png size 320 66
    player.songticker.font ch 10 22 spacing -1 0
`
result =
{
    "tokens": [
        {
            "phase": "lex",
            "kind": "Decorator",
            "name": "type",
            "args": [],
            "indent": 0,
            "line": 1
        },
        {
            "phase": "lex",
            "kind": "Words",
            "tokens": [
                "font.bitmap"
            ],
            "indent": 0,
            "line": 2
        },
        {
            "phase": "lex",
            "kind": "Words",
            "tokens": [
                "size",
                "int",
                "int"
            ],
            "indent": 1,
            "line": 3
        },
        {
            "phase": "lex",
            "kind": "Words",
            "tokens": [
                "ch",
                "int",
                "int"
            ],
            "indent": 1,
            "line": 4
        },
        {
            "phase": "lex",
            "kind": "Words",
            "tokens": [
                "spacing",
                "int",
                "int"
            ],
            "indent": 1,
            "line": 5
        },
        {
            "phase": "lex",
            "kind": "Decorator",
            "name": "font.bitmap",
            "args": [],
            "indent": 0,
            "line": 7
        },
        {
            "phase": "lex",
            "kind": "Words",
            "tokens": [
                "player/songtickerfont.png",
                "size",
                320,
                66
            ],
            "indent": 0,
            "line": 8
        },
        {
            "phase": "lex",
            "kind": "Words",
            "tokens": [
                "player.songticker.font",
                "ch",
                10,
                22,
                "spacing",
                -1,
                0
            ],
            "indent": 1,
            "line": 9
        }
    ],
    "ast": {
        "type": "file",
        "children": [
            {
                "type": "type",
                "name": null,
                "children": [],
                "decls": []
            },
            {
                "type": "font.bitmap",
                "name": null,
                "children": [],
                "decls": [],
                "schema": null
            }
        ],
        "decls": [
            {
                "kind": "Declaration",
                "name": "font.bitmap",
                "tokens": []
            },
            {
                "kind": "Declaration",
                "name": "player/songtickerfont.png",
                "tokens": [
                    "size",
                    320,
                    66
                ]
            }
        ]
    },
    "registry": {
        "null": []
    }
}