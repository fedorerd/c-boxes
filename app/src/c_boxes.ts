export type CBoxes = {
  "version": "0.1.0",
  "name": "c_boxes",
  "instructions": [
    {
      "name": "execute",
      "accounts": [
        {
          "name": "boxOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "boxMerkleTree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "boxSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mplBubblegum",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splAccountCompression",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "ExecuteData"
          }
        }
      ]
    }
  ],
  "types": [
    {
      "name": "ExecuteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boxRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "boxDataHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "boxCreatorHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "boxNonce",
            "type": "u64"
          },
          {
            "name": "boxIndex",
            "type": "u32"
          },
          {
            "name": "boxProofsLength",
            "type": "u8"
          },
          {
            "name": "ixData",
            "type": "bytes"
          }
        ]
      }
    }
  ]
};

export const IDL: CBoxes = {
  "version": "0.1.0",
  "name": "c_boxes",
  "instructions": [
    {
      "name": "execute",
      "accounts": [
        {
          "name": "boxOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "boxMerkleTree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "boxSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mplBubblegum",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splAccountCompression",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "ExecuteData"
          }
        }
      ]
    }
  ],
  "types": [
    {
      "name": "ExecuteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boxRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "boxDataHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "boxCreatorHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "boxNonce",
            "type": "u64"
          },
          {
            "name": "boxIndex",
            "type": "u32"
          },
          {
            "name": "boxProofsLength",
            "type": "u8"
          },
          {
            "name": "ixData",
            "type": "bytes"
          }
        ]
      }
    }
  ]
};
