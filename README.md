## FoodChain

A supply chain transparency app to enhance agriculture.

Project Architecture:
```mermaid
%%{init: {'themeVariables': {'scale': 0.7}}}%%
sequenceDiagram
    Client (Web App) ->> API (Express.js): Query (/GET or /POST)
    API (Express.js) ->> Client (Web App): Data Return
    Blockchain Server (Hyperledger Fabric) -->> API (Express.js): Data
    API (Express.js) -->> Blockchain Server (Hyperledger Fabric): Chaincode Excution
```

### Find our work:
- [Planning Docs](/Spec.md) (technical specifications and requirements) 
- [Code]()
    - [Blockchain Backend](/Backend/)
    - **WIP** [API]()
    - **WIP** [UI/frontend]()
- [Testing]()
    - Integration tests
    - Unit tests
- [Reflection]() (What can we add?)


An International hackathon for 12-18 year old high schooler and middle schoolers hosted by Hack Club, the world's largest open-source student organization, is happening in Seattle.

Scrapyard Seattle is on March 15th-16th!

Free food🍕 and Tech SWAG🧢 will be provided. 
Sign up: https://scrapyard.hackclub.com/seattle

Venue: (given out to participants)
