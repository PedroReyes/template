# Solidity API

## Box

Example of a simple box that can store a value.

_All function calls are currently implemented without side effects_

### _value

```solidity
uint256 _value
```

### ValueChanged

```solidity
event ValueChanged(uint256 value)
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(uint256 initialValue) public payable
```

### store

```solidity
function store(uint256 value) public
```

Updates the stored value and emits a ValueChanged event

_The caller must be the transparent upgradable proxy contract.
This restriction can be removed by removing the initializer modifier from the initialize function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | the new value to store. It can hold non-negative whole numbers ranging from 0 to 2^256-1. |

### retrieve

```solidity
function retrieve() public view returns (uint256)
```

Reads the last stored value

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | the last stored value |

