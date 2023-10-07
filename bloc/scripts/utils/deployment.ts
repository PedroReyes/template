import { ethers } from "ethers";
import fs from "fs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import dotenv from "dotenv";
dotenv.config();

// Deployments outputs
const DEPLOYMENTS_FILE = "deployments.json";
const DEPLOYMENTS_FILE_PATH = `./${DEPLOYMENTS_FILE}`;
export const DEPLOYMENTS_FOLDERS = [
    DEPLOYMENTS_FILE_PATH,
    process.env.RELEASE_PATH ? process.env.RELEASE_PATH + `/${DEPLOYMENTS_FILE}` : undefined,
    // "../server/functions/src/deployments.json",
    // "../server/functions/lib/src/deployments.json"
];

// Changing colors in node console
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
export const COLOR_RESET = "\x1b[0m";
export const FG_COLOR_RED = "\x1b[31m";
export const FG_COLOR_YELLOW = "\x1b[33m";

/**
 * Returns true if the network name is a testnet or localhost network
 * @param deploymentNetwork
 */
export function isTestnetNetwork(deploymentNetwork: string): boolean {
    if (
        [
            "hardhat",
            "localhost",
            "bscTestnet",
            "ropsten",
            "rinkeby",
            "goerli",
        ].includes(deploymentNetwork)
    )
        return true;

    if (["bscMainnet"].includes(deploymentNetwork)) return false;

    throw "❌ Unknown network. Please, identify whether it is a testnet network or not";
}

/**
 *
 * @param deploymentNetwork
 * @param contractName
 * @returns contract address
 */
export function getContractField(
    deploymentNetwork: string,
    contractName: string,
    otherField: string = "address"
): string {
    if (!fs.existsSync(DEPLOYMENTS_FILE_PATH)) {
        const WARNING_MESSAGE = " ⚠  Deployment file does not exist";
        console.log(FG_COLOR_YELLOW);
        console.warn(WARNING_MESSAGE);
        console.log(COLOR_RESET);
        return "";
    }

    if (deploymentNetwork === "hardhat") {
        const ERROR_MESSAGE =
            "❗  Error: Deployment on hardhat network not allowed";
        console.log(FG_COLOR_RED);
        console.error(ERROR_MESSAGE);
        console.log(COLOR_RESET);
        return "";
    }

    // Get current deployments
    let deploymentsFileContent = fs
        .readFileSync(DEPLOYMENTS_FILE_PATH)
        .toString().trim();

    if (deploymentsFileContent === "") {
        return "";
    }

    let deployments: any = JSON.parse(deploymentsFileContent);

    if (
        !deployments[deploymentNetwork] ||
        !deployments[deploymentNetwork][contractName]
    ) {
        return "";
    }

    // Return contract address
    return deployments[deploymentNetwork][contractName][otherField]
        ? deployments[deploymentNetwork][contractName][otherField]
        : "";
}

/**
 * Adds the smart contract address where the contract has been deployed
 *
 * @param deploymentNetwork
 * @param contractName
 * @param contractAddress
 */
export async function addDeployment(
    deploymentNetwork: string,
    contractName: string,
    contract: any,
    contractABI: string[],
    transactionHashContractCreation: string = ""
) {
    // Get git branch name, git user name using syncExec and current date using format YYYY-MM-DD HH:mm:ss CET
    const { execSync } = require("child_process");
    const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    const userName = execSync("git log -n 1 --pretty=format:%an").toString().trim();
    // const userEmail = execSync("git log -n 1 --pretty=format:%ae").toString().trim();
    const developerData = `${userName}`;// <${userEmail}>`;
    const currentDate = new Date().toLocaleString("sv", { timeZone: "Europe/Paris" }) + " CET";

    // Main variables
    let contractAddress = await contract.getAddress();
    let deployments: any = {};
    let deploymentsFileContent = JSON.stringify(deployments);

    // Get transaction hash if not provided
    if (transactionHashContractCreation === "") {
        transactionHashContractCreation = getContractField(
            deploymentNetwork,
            contractName,
            "transactionHash"
        );
    }

    // Extract roles if any from the contracts
    let roles: any = {};
    try {
        // Get roles array
        let contractRoles = await contract.getRoles();

        console.log("Roles found: " + contractRoles.length + " roles.");

        if (contractRoles.length > 0) {
            // Sweep over each contract role provided
            for (let i = 0; i < contractRoles.length; i++) {
                // Get the role
                let roleName = contractRoles[i];

                // Get the role members
                let roleMembers = await getRoleMembers(contract, roleName);

                // Add the role to the contract
                roles[roleName] = roleMembers;
            }
        }

        console.log("\n✅ Roles found for contract " + contractName);
        console.log(roles);
    } catch (e) {
        console.log("\n❌ No roles found for contract " + contractName);
    }

    try {
        // Create file if it doesn't exists
        if (!fs.existsSync(DEPLOYMENTS_FILE_PATH)) {
            console.log("\n📃 Creating deployment file...");

            fs.writeFileSync(DEPLOYMENTS_FILE_PATH, JSON.stringify(deployments));
        } else {
            console.log("\n📃 Reading deployment file...");

            // Get current deployments
            deploymentsFileContent = fs
                .readFileSync(DEPLOYMENTS_FILE_PATH)
                .toString().trim();

            if (deploymentsFileContent === "") {
                deploymentsFileContent = "{}";
            }
        }

        // Getting current deployments
        deployments = JSON.parse(deploymentsFileContent);

        // Storing current deployment history
        let currentDeploymentHistory = [];
        if (deployments[deploymentNetwork] && deployments[deploymentNetwork][contractName] && deployments[deploymentNetwork][contractName].deploymentHistory) {
            currentDeploymentHistory = deployments[deploymentNetwork][contractName].deploymentHistory;
        }

        // Update JSON with new contract address
        const releaseDeployments: any = {};

        deployments[deploymentNetwork] = deployments[deploymentNetwork] ?? {};
        releaseDeployments[deploymentNetwork] = releaseDeployments[deploymentNetwork] ?? {};

        let newContractDeployed = {
            address: contractAddress,
            ABI: contractABI,
            roles: roles,
            transactionHash: transactionHashContractCreation,
        };


        deployments[deploymentNetwork][contractName] = newContractDeployed;
        releaseDeployments[deploymentNetwork][contractName] = newContractDeployed;

        // Update JSON with track record data (who, when, branch)
        const deploymentRecord = {
            developer: developerData,
            date: currentDate,
            branch: branchName,
            hash: transactionHashContractCreation,
            address: contractAddress,
        };

        deployments[deploymentNetwork][contractName].deploymentHistory = [deploymentRecord, ...currentDeploymentHistory];
        releaseDeployments[deploymentNetwork][contractName].deploymentHistory = [deploymentRecord, ...currentDeploymentHistory];

        // Sorting JSON before saving into file
        deployments = Object.keys(deployments)
            .sort()
            .reduce((r: any, k: any) => ((r[k] = deployments[k]), r), {});

        Object.keys(deployments).forEach((element) => {
            deployments[element] = sortObjectByKeys(deployments[element]);
        });

        // Save file
        for (let SERVICES_DEPLOYMENT_FOLDER of DEPLOYMENTS_FOLDERS) {
            if (SERVICES_DEPLOYMENT_FOLDER) {
                console.log(`\n🔁 Updating deployment file ${isReleaseFolder(SERVICES_DEPLOYMENT_FOLDER) ? "(🚀 release folder)" : ""}: ` + SERVICES_DEPLOYMENT_FOLDER)

                fs.writeFileSync(

                    SERVICES_DEPLOYMENT_FOLDER,
                    isReleaseFolder(SERVICES_DEPLOYMENT_FOLDER) ? JSON.stringify(releaseDeployments, null, "\t") :
                        JSON.stringify(deployments, null, "\t")
                );
            }
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Verify the contract in the blockchain explorer
 *
 * @param hre
 * @param contractName
 * @param contract
 * @param constructorArguments
 */
export async function verifyDeploymentWithContract(
    hre: HardhatRuntimeEnvironment,
    contractName: string,
    contractAddress: string,
    constructorArguments: any,
    contractPath?: string
) {

    // Verify the contract
    verifyDeploymentWithAddress(
        hre,
        contractName,
        contractAddress,
        constructorArguments,
        contractPath
    );
}

/**
 * Verify the contract in the blockchain explorer
 *
 * @param hre
 * @param contractName
 * @param contractAddress
 * @param constructorArguments
 */
async function verifyDeploymentWithAddress(
    hre: HardhatRuntimeEnvironment,
    contractName: string,
    contractAddress: string,
    constructorArguments: any,
    contractPath?: string
) {
    console.log(`\n✅ Verifying ${contractName} ... ${contractAddress}`);

    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArguments,
            contract: contractPath,
        });
    } catch (e) {
        console.error(`🔴 ${contractName}.sol probably is already verified\n`);
        console.error(e);
    }
}

/**
 * Retrieve all the members belonging to a certain role
 *
 * @param contract (i.e, await getStrategyContract(network, library, userAddress);)
 * @param role
 * @returns
 */
export async function getRoleMembers(
    contract: any,
    role: string
): Promise<string[]> {
    if (!contract) return [];

    let roleMembersCount: number = 0;
    let members: string[] = [];

    let roleHash: any = getRoleByte(role);

    console.log(`Role hash ${role}: ` + roleHash);

    try {
        roleMembersCount = await contract.getRoleMemberCount(roleHash);

        for (let index = 0; index < roleMembersCount; ++index) {
            let member = await contract.getRoleMember(roleHash, index);

            members.push(member);
        }
    } catch (e) {
        console.log(e);
    }

    return members;
}

/**
 * Returns the role turned into bytes
 *
 * @param role
 * @returns
 */
function getRoleByte(role: string) {
    let roleBytes: any = "";

    if (role.toString() === "DEFAULT_ADMIN_ROLE") {
        roleBytes = ethers.ZeroAddress;// + "000000000000000000000000";
    } else {
        roleBytes = ethers.keccak256(ethers.toUtf8Bytes(role));
    }
    return roleBytes;
}

/**
 * sort object by keys
 *
 * @param o
 * @returns
 */
function sortObjectByKeys(o: any) {
    return Object.keys(o)
        .sort()
        .reduce((r: any, k: any) => ((r[k] = o[k]), r), {});
}


/**
 * The function checks if a given path is the release folder based on the environment variable
 * `RELEASE_PATH`.
 * @param {string} path - A string representing the path of a folder.
 * @returns a boolean value.
 */
function isReleaseFolder(path: string) {
    return process.env.RELEASE_PATH && path && path != "" && path.includes(process.env.RELEASE_PATH);
}