# Configuration Retrieval Documentation

This documentation outlines the process for retrieving vehicle configuration information from the backend server using a frontend application. The frontend initiates a GET request to a specific URL, and the server responds with a JSON body containing the requested configuration.

## Endpoint Details

The frontend should make a GET request to the following endpoint:

```http
GET http://{{address}}:{{port}}/api/configurations/content/{vehicle-id}/{device-id}/{configuration-id}
```

- `{{address}}`: The server address.
- `{{port}}`: The port number on which the server is running.
- `{vehicle-id}`: The unique identifier for the vehicle.
- `{device-id}`: The unique identifier for the device.
- `{configuration-id}`: The identifier for the specific configuration.

## Response Format

The server responds with a JSON body representing the requested configuration. The structure of this JSON is defined by the JSON schema stored in the repository.

## Validation using Commit Hash

To ensure the integrity of the retrieved configuration, the response headers include the `X-ConfigurationVersionHash`. This header contains the hash of the commit from the repository where the JSON schemas for configurations are stored.

The frontend can use this commit hash to verify and validate the received configuration against the specific version of the JSON schema in the repository.

# Dynamic Form Rendering and Schema Retrieval

To facilitate dynamic form rendering for modifying configuration data, the frontend can retrieve the corresponding JSON schema by making a GET request to the following URL:

```http
GET http://{{address}}:{{port}}/api/schema/{{commit-hash}}/{{configuration-id}}
```

- `{{address}}`: The server address.
- `{{port}}`: The port number on which the server is running.
- `{{commit-hash}}`: The commit hash obtained from the previous configuration request.
- `{{configuration-id}}`: The identifier for the specific configuration.

## Retrieving JSON Schema

The server responds with the JSON schema associated with the requested configuration. This schema provides information about the structure and constraints of the configuration data.

## Dynamic Form Rendering

With the obtained JSON schema, the frontend can dynamically render a form to allow users to modify the configuration data. The form elements correspond to the parameters defined in the schema, and their types are determined by the schema as well.

By combining the configuration retrieval process and dynamic form rendering, the frontend can seamlessly fetch, display, and modify configurations with real-time validation based on the associated JSON schema.