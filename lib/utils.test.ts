import { expect, test, describe, beforeAll, afterAll } from "@jest/globals";
import {
  schemaResolve,
  contentDefaultValues,
  groupKeys,
  splitKeyDisplay,
} from "@/lib/utils";

describe("schemaResolve", () => {
  beforeAll(() => {
    console.log("Starting schemaResolve tests");
  });

  afterAll(() => {
    console.log("Finishing schemaResolve tests");
  });

  test("Object containt object with path $ref", () => {
    const testSchema = {
      $ref: "#/definitions/TelemetryConfig",
      definitions: {
        TelemetryConfig: {
          properties: {},
        },
      },
    };

    expect(schemaResolve(testSchema, testSchema)).toEqual(
      testSchema.definitions.TelemetryConfig
    );
  });

  test("Null object", () => {
    const testSchema = null;

    expect(schemaResolve(testSchema, testSchema)).toBeNull();
  });

  test("Object's type is string", () => {
    const testSchema = {
      type: "string",
    };

    expect(schemaResolve(testSchema, testSchema)).toEqual(testSchema);
  });

  test("Object's type is integer", () => {
    const testSchema = {
      type: "integer",
    };

    expect(schemaResolve(testSchema, testSchema)).toEqual(testSchema);
  });

  test("Object's type is number", () => {
    const testSchema = {
      type: "number",
    };

    expect(schemaResolve(testSchema, testSchema)).toEqual(testSchema);
  });

  test("Object's type is boolean", () => {
    const testSchema = {
      type: "boolean",
    };

    expect(schemaResolve(testSchema, testSchema)).toEqual(testSchema);
  });

  test("Object's type is array", () => {
    const testSchema = {
      type: "array",
      items: {
        type: "string",
      },
    };

    expect(schemaResolve(testSchema, testSchema)).toEqual(testSchema);
  });

  test("Object's type is object", () => {
    const testSchema = {
      type: "object",
      properties: {
        socket: {
          type: "string",
        },
        name: {
          type: "string",
        },
        networks: {
          items: {
            type: "string",
          },
          type: "array",
        },
      },
    };

    expect(schemaResolve(testSchema, testSchema)).toEqual(testSchema);
  });
});

describe("contentDefaultValues", () => {
  beforeAll(() => {
    console.log("Starting contentDefaultValues tests");
  });

  afterAll(() => {
    console.log("Finishing contentDefaultValues tests");
  });

  test("Popolate object", () => {
    const testSchema = {
      properties: {
        socket: {
          type: "string",
        },
        name: {
          type: "string",
        },
        networks: {
          items: {
            type: "string",
          },
          type: "array",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Can Device",
    };

    const testContent = {
      socket: "can0",
      name: "CAN Device 1",
      networks: ["network1", "network2"],
    };

    const expectedResult = {
      socket: "can0",
      name: "CAN Device 1",
      "networks/0": "network1",
      "networks/1": "network2",
    };

    expect(contentDefaultValues(testSchema, testContent)).toEqual(
      expectedResult
    );
  });

  test("Popolate object with object inside", () => {
    const testSchema = {
      properties: {
        enabled: {
          type: "boolean",
        },
        downsampleEnabled: {
          type: "boolean",
        },
        downsampleSkipData: {
          type: "boolean",
        },
        downsampleMps: {
          type: "integer",
        },
        sendRate: {
          type: "integer",
        },
        sendSensorData: {
          type: "boolean",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Connection Settings",
    };

    const testContent = {
      enabled: true,
      downsampleEnabled: false,
      downsampleSkipData: true,
      downsampleMps: 5,
      sendRate: 10,
      sendSensorData: true,
    };

    const expectedResult = {
      enabled: true,
      downsampleEnabled: false,
      downsampleSkipData: true,
      downsampleMps: 5,
      sendRate: 10,
      sendSensorData: true,
    };

    expect(contentDefaultValues(testSchema, testContent)).toEqual(
      expectedResult
    );
  });

  test("Popolate object with array inside", () => {
    const testSchema = {
      properties: {
        socket: {
          type: "string",
        },
        name: {
          type: "string",
        },
        networks: {
          items: {
            type: "string",
          },
          type: "array",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Can Device",
    };

    const testContent = {
      socket: "can0",
      name: "CAN Device 1",
      networks: ["network1", "network2"],
    };

    const expectedResult = {
      socket: "can0",
      name: "CAN Device 1",
      "networks/0": "network1",
      "networks/1": "network2",
    };

    expect(contentDefaultValues(testSchema, testContent)).toEqual(
      expectedResult
    );
  });
});

describe("groupKeys", () => {
  beforeAll(() => {
    console.log("Starting groupKeys tests");
  });

  afterAll(() => {
    console.log("Finishing groupKeys tests");
  });

  test("Telemetry config schema simulation", () => {
    const testObject = {
      cameraEnabled: true,
      generateCsv: false,
      "connection/ip": "192.168.1.1",
      "connection/port": "8080",
      "connection/mode": "tcp",
      "connection/whoamiUrl": "http://example.com/whoami",
      "connection/tlsEnabled": true,
      "connection/cafile": "/path/to/cafile.pem",
      "connection/capath": "/path/to/capath",
      "connection/certfile": "/path/to/certfile.pem",
      "connection/keyfile": "/path/to/keyfile.pem",
      "connectionSettings/enabled": true,
      "connectionSettings/downsampleEnabled": false,
      "connectionSettings/downsampleSkipData": true,
      "connectionSettings/downsampleMps": 5,
      "connectionSettings/sendRate": 10,
      "connectionSettings/sendSensorData": true,
      "canDevices/0/socket": "can0",
      "canDevices/0/name": "CAN Device 1",
      "canDevices/0/networks/0": "network1",
      "canDevices/0/networks/1": "network2",
      "canDevices/1/socket": "can1",
      "canDevices/1/name": "CAN Device 2",
      "canDevices/1/networks/0": "network3",
      "canDevices/1/networks/1": "network4",
      "gpsDevices/0/address": "GPS1_Address",
      "gpsDevices/0/mode": "high_accuracy",
      "gpsDevices/0/enabled": true,
      "gpsDevices/1/address": "GPS2_Address",
      "gpsDevices/1/mode": "low_power",
      "gpsDevices/1/enabled": false,
    };

    const schema = {
      required: [
        "cameraEnabled",
        "generateCsv",
        "connection",
        "connectionSettings",
        "canDevices",
        "gpsDevices",
      ],
      properties: {
        cameraEnabled: {
          type: "boolean",
        },
        generateCsv: {
          type: "boolean",
        },
        connection: {
          required: [
            "ip",
            "port",
            "mode",
            "whoamiUrl",
            "tlsEnabled",
            "cafile",
            "capath",
            "certfile",
            "keyfile",
          ],
          properties: {
            ip: {
              type: "string",
            },
            port: {
              type: "string",
            },
            mode: {
              type: "string",
            },
            whoamiUrl: {
              type: "string",
            },
            tlsEnabled: {
              type: "boolean",
            },
            cafile: {
              type: "string",
            },
            capath: {
              type: "string",
            },
            certfile: {
              type: "string",
            },
            keyfile: {
              type: "string",
            },
          },
          additionalProperties: false,
          type: "object",
          title: "Connection",
        },
        connectionSettings: {
          required: [
            "enabled",
            "downsampleEnabled",
            "downsampleSkipData",
            "downsampleMps",
            "sendRate",
            "sendSensorData",
          ],
          properties: {
            enabled: {
              type: "boolean",
            },
            downsampleEnabled: {
              type: "boolean",
            },
            downsampleSkipData: {
              type: "boolean",
            },
            downsampleMps: {
              type: "integer",
            },
            sendRate: {
              type: "integer",
            },
            sendSensorData: {
              type: "boolean",
            },
          },
          additionalProperties: false,
          type: "object",
          title: "Connection Settings",
        },
        canDevices: {
          items: {
            required: ["socket", "name", "networks"],
            properties: {
              socket: {
                type: "string",
              },
              name: {
                type: "string",
              },
              networks: {
                items: {
                  type: "string",
                },
                type: "array",
              },
            },
            additionalProperties: false,
            type: "object",
            title: "Can Device",
          },
          additionalProperties: false,
          type: "array",
        },
        gpsDevices: {
          items: {
            required: ["address", "mode", "enabled"],
            properties: {
              address: {
                type: "string",
              },
              mode: {
                type: "string",
              },
              enabled: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            type: "object",
            title: "Gps Device",
          },
          additionalProperties: false,
          type: "array",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Telemetry Config",
    };

    const expectedResult = {
      cameraEnabled: true,
      generateCsv: false,
      connection: {
        ip: "192.168.1.1",
        port: "8080",
        mode: "tcp",
        whoamiUrl: "http://example.com/whoami",
        tlsEnabled: true,
        cafile: "/path/to/cafile.pem",
        capath: "/path/to/capath",
        certfile: "/path/to/certfile.pem",
        keyfile: "/path/to/keyfile.pem",
      },
      connectionSettings: {
        enabled: true,
        downsampleEnabled: false,
        downsampleSkipData: true,
        downsampleMps: 5,
        sendRate: 10,
        sendSensorData: true,
      },
      canDevices: [
        {
          socket: "can0",
          name: "CAN Device 1",
          networks: ["network1", "network2"],
        },
        {
          socket: "can1",
          name: "CAN Device 2",
          networks: ["network3", "network4"],
        },
      ],
      gpsDevices: [
        {
          address: "GPS1_Address",
          mode: "high_accuracy",
          enabled: true,
        },
        {
          address: "GPS2_Address",
          mode: "low_power",
          enabled: false,
        },
      ],
    };

    expect(groupKeys(testObject, schema)).toEqual(expectedResult);
  });

  test("Grouping an empty object", () => {
    const testObject = {};
    const schema = {};
    const expectedResult = {};
    expect(groupKeys(testObject, schema)).toEqual(expectedResult);
  });

  test("Grouping nested objects with non-empty values", () => {
    const testObject = {
      "nested/nonempty/value": "test",
      "nested/nonempty/anotherValue": "anotherTest",
    };

    const schema = {
      properties: {
        nested: {
          properties: {
            nonempty: {
              properties: {
                value: {
                  type: "string",
                },
                anotherValue: {
                  type: "string",
                },
              },
              additionalProperties: false,
              type: "object",
              title: "Nonempty",
            },
          },
          additionalProperties: false,
          type: "object",
          title: "Nested",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Test",
    };

    const expectedResult = {
      nested: {
        nonempty: {
          value: "test",
          anotherValue: "anotherTest",
        },
      },
    };
    expect(groupKeys(testObject, schema)).toEqual(expectedResult);
  });

  test("Grouping keys containing special characters", () => {
    const testObject = {
      "special/char%": "test1",
      "special/char$": "test2",
    };

    const schema = {
      properties: {
        special: {
          properties: {
            "char%": {
              type: "string",
            },
            char$: {
              type: "string",
            },
          },
          additionalProperties: false,
          type: "object",
          title: "Special",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Test",
    };

    const expectedResult = {
      special: {
        "char%": "test1",
        char$: "test2",
      },
    };
    expect(groupKeys(testObject, schema)).toEqual(expectedResult);
  });

  test("Grouping array", () => {
    const testObject = {
      "canDevices/0": "can0",
      "canDevices/1": "can1",
      "gpsDevices/0": "GPS1_Address",
      "gpsDevices/1": "GPS2_Address",
    };

    const schema = {
      properties: {
        canDevices: {
          items: {
            type: "string",
          },
          type: "array",
        },
        gpsDevices: {
          items: {
            type: "string",
          },
          type: "array",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Test",
    };

    const expectedResult = {
      canDevices: ["can0", "can1"],
      gpsDevices: ["GPS1_Address", "GPS2_Address"],
    };

    expect(groupKeys(testObject, schema)).toEqual(expectedResult);
  });

  test("Grouping keys with array containing objects", () => {
    const testObject = {
      "arrayObject/0/property": "value",
      "arrayObject/1/property": "value",
      "arrayObject/2/property": "value",
    };

    const schema = {
      properties: {
        arrayObject: {
          items: {
            type: "object",
            properties: {
              property: {
                type: "string",
              },
            },
            additionalProperties: false,
            required: ["property"],
          },
          type: "array",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Test",
    };

    const expectedResult = {
      arrayObject: [
        { property: "value" },
        { property: "value" },
        { property: "value" },
      ],
    };
    expect(groupKeys(testObject, schema)).toEqual(expectedResult);
  });

  test("Grouping keys with array containing primitives", () => {
    const testObject = {
      "arrayPrimitive/0": "value1",
      "arrayPrimitive/1": "value2",
      "arrayPrimitive/2": "value3",
    };

    const schema = {
      properties: {
        arrayPrimitive: {
          items: {
            type: "string",
          },
          type: "array",
        },
      },
      additionalProperties: false,
      type: "object",
      title: "Test",
    };

    const expectedResult = {
      arrayPrimitive: ["value1", "value2", "value3"],
    };
    expect(groupKeys(testObject, schema)).toEqual(expectedResult);
  });
});

describe("splitKeyDisplay", () => {
  test("should return an empty string if input ends with slash followed by numbers", () => {
    expect(splitKeyDisplay("some/key/123")).toBe("");
    expect(splitKeyDisplay("another/key/987654")).toBe("");
  });

  test("should split camelCase string into display-friendly format", () => {
    expect(splitKeyDisplay("camelCaseString")).toBe("camel case string");
    expect(splitKeyDisplay("anotherCamelCaseExample")).toBe(
      "another camel case example"
    );
  });

  test("should handle input with no camelCase formatting", () => {
    expect(splitKeyDisplay("noCamelCaseHere")).toBe("no camel case here");
  });

  test("should handle input with multiple slashes", () => {
    expect(splitKeyDisplay("some/multi/part/key")).toBe("key");
  });

  test("should handle input with special characters", () => {
    expect(splitKeyDisplay("special/char/key%")).toBe("key%");
    expect(splitKeyDisplay("special/char/key$")).toBe("key$");
  });

  test("should handle empty input", () => {
    expect(splitKeyDisplay("")).toBe("");
  });
});
