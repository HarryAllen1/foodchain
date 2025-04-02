# FoodChain

A supply chain transparency app to enhance agriculture.

## Project Architecture

```mermaid
%%{init: {'themeVariables': {'scale': 0.7}}}%%
sequenceDiagram
    Client (Web App) ->> API (Express.js): Query (/GET or /POST)
    API (Express.js) ->> Client (Web App): Data Return
    Blockchain Server (Hyperledger Fabric) -->> API (Express.js): Data
    API (Express.js) -->> Blockchain Server (Hyperledger Fabric): Chaincode Excution
```
![Description of how the software works](/Food%20Chain%20Diagram.svg)
## Find our work:
- [Planning Docs](/Spec.md) (technical specifications and requirements) 
- [Code]()
    - [Blockchain Backend](/Backend/)
    - **WIP** [API]()
    - [Frontend](/app)
- [Testing]()
    - Integration tests
    - Unit tests
- [Reflection]() (What can we add?)
