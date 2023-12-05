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

## Conclusion

By following these steps, the frontend can successfully retrieve vehicle configurations from the server, ensuring data integrity and consistency by validating against the corresponding JSON schema commit hash.