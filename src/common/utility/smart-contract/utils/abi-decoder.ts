const { sha3, BN } = require('web3-utils');
const abiCoder = require('web3-eth-abi');

const state = {
  savedABIs: [],
  methodIDs: {},
};

const getABIs = () => {
  return state.savedABIs;
};

const addABI = (abiArray) => {
  if (Array.isArray(abiArray)) {
    // Iterate new abi to generate method id"s
    abiArray.map(function (abi) {
      if (abi.name) {
        const signature = sha3(
          abi.name + '(' + abi.inputs.map(typeToString).join(',') + ')',
        );
        if (abi.type === 'event') {
          state.methodIDs[signature.slice(2)] = abi;
        } else {
          state.methodIDs[signature.slice(2, 10)] = abi;
        }
      }
    });

    state.savedABIs = state.savedABIs.concat(abiArray);
  } else {
    throw new Error('Expected ABI array, got ' + typeof abiArray);
  }
};

const removeABI = (abiArray) => {
  if (Array.isArray(abiArray)) {
    // Iterate new abi to generate method id"s
    abiArray.map(function (abi) {
      if (abi.name) {
        const signature = sha3(
          abi.name +
            '(' +
            abi.inputs
              .map(function (input) {
                return input.type;
              })
              .join(',') +
            ')',
        );
        if (abi.type === 'event') {
          if (state.methodIDs[signature.slice(2)]) {
            delete state.methodIDs[signature.slice(2)];
          }
        } else {
          if (state.methodIDs[signature.slice(2, 10)]) {
            delete state.methodIDs[signature.slice(2, 10)];
          }
        }
      }
    });
  } else {
    throw new Error('Expected ABI array, got ' + typeof abiArray);
  }
};

const getMethodIDs = () => {
  return state.methodIDs;
};

const decodeMethod = (data) => {
  const methodID = data.slice(2, 10);
  const abiItem = state.methodIDs[methodID];
  if (abiItem) {
    const decoded = abiCoder.decodeParameters(abiItem.inputs, data.slice(10));

    const retData = {
      name: abiItem.name,
      params: [],
    };

    for (let i = 0; i < decoded.__length__; i++) {
      const param = decoded[i];
      let parsedParam = param;
      const isUint = abiItem.inputs[i].type.indexOf('uint') === 0;
      const isInt = abiItem.inputs[i].type.indexOf('int') === 0;
      const isAddress = abiItem.inputs[i].type.indexOf('address') === 0;

      if (isUint || isInt) {
        const isArray = Array.isArray(param);

        if (isArray) {
          parsedParam = param.map((val) => new BN(val).toString());
        } else {
          parsedParam = new BN(param).toString();
        }
      }

      // Addresses returned by web3 are randomly cased so we need to standardize and lowercase all
      if (isAddress) {
        const isArray = Array.isArray(param);

        if (isArray) {
          parsedParam = param.map((p) => p.toLowerCase());
        } else {
          parsedParam = param.toLowerCase();
        }
      }

      retData.params.push({
        name: abiItem.inputs[i].name,
        value: parsedParam,
        type: abiItem.inputs[i].type,
      });
    }

    return retData;
  }
};

const decodeLogs = (logs) => {
  return logs
    .filter((log) => log.topics.length > 0)
    .map((logItem) => {
      const methodID = logItem.topics[0].slice(2);
      const method = state.methodIDs[methodID];
      if (method) {
        const logData = logItem.data;
        const decodedParams = [];
        let dataIndex = 0;
        let topicsIndex = 1;

        const dataTypes = [];
        method.inputs.map(function (input) {
          if (!input.indexed) {
            dataTypes.push(input.type);
          }
        });

        const decodedData = abiCoder.decodeParameters(
          dataTypes,
          logData.slice(2),
        );

        // Loop topic and data to get the params
        method.inputs.map(function (param) {
          const decodedP = {
            name: param.name,
            type: param.type,
          };

          if (param.indexed) {
            (decodedP as any).value = logItem.topics[topicsIndex];
            topicsIndex++;
          } else {
            (decodedP as any).value = decodedData[dataIndex];
            dataIndex++;
          }

          if (param.type === 'address') {
            (decodedP as any).value = (decodedP as any).value.toLowerCase();
            // 42 because len(0x) + 40
            if ((decodedP as any).value.length > 42) {
              const toRemove = (decodedP as any).value.length - 42;
              const temp = (decodedP as any).value.split('');
              temp.splice(2, toRemove);
              (decodedP as any).value = temp.join('');
            }
          }

          if (
            param.type === 'uint256' ||
            param.type === 'uint8' ||
            param.type === 'int'
          ) {
            // ensure to remove leading 0x for hex numbers
            if (
              typeof (decodedP as any).value === 'string' &&
              (decodedP as any).value.startsWith('0x')
            ) {
              (decodedP as any).value = new BN(
                (decodedP as any).value.slice(2),
                16,
              ).toString(10);
            } else {
              (decodedP as any).value = new BN(
                (decodedP as any).value,
              ).toString(10);
            }
          }

          decodedParams.push(decodedP);
        });

        return {
          name: method.name,
          events: decodedParams,
          address: logItem.address,
        };
      }
    });
};

function typeToString(input) {
  if (input.type === 'tuple') {
    return '(' + input.components.map(typeToString).join(',') + ')';
  }
  return input.type;
}

export { getABIs, addABI, getMethodIDs, decodeMethod, decodeLogs, removeABI };
