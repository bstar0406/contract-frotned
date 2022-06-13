const Moralis = require("moralis");

const serverUrl = "https://q5qrtbagdbyq.usemoralis.com:2053/server";
const appId = "aW3NsuT7adVQ7tyGcpb7e5b87SEj0OMhyqOQtLnj";
Moralis.start({ serverUrl, appId });

export default Moralis;
