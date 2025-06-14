import {
  Client,
  PrivateKey,
  AccountId,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TokenNftInfoQuery,
  TransferTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  Hbar
} from '@hashgraph/sdk';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

let client;
let operatorId;
let operatorKey;


console.log('Hedera account Id:', process.env.HEDERA_ACCOUNT_ID);
export async function initializeHedera() {
  try {
    // Configuration du client Hedera
    operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
    operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

    if (process.env.HEDERA_NETWORK === 'mainnet') {
      client = Client.forMainnet();
    } else {
      client = Client.forTestnet();
    }

    client.setOperator(operatorId, operatorKey);
    
    // Test de connexion
    const balance = await client.getAccountBalance(operatorId);
    logger.info(`Hedera initialisé - Balance: ${balance.hbars.toString()}`);
    
    return client;
  } catch (error) {
    logger.error('Erreur lors de l\'initialisation Hedera:', error);
    throw error;
  }
}

export async function createMedicineNFT(medicineData, batchData) {
  try {
    // Création du token NFT pour le médicament
    const tokenCreateTx = new TokenCreateTransaction()
      .setTokenName(`MedTrack-${medicineData.name}`)
      .setTokenSymbol('MEDTRACK')
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(operatorId)
      .setSupplyType(TokenSupplyType.Infinite)
      .setSupplyKey(operatorKey)
      .setMaxTransactionFee(new Hbar(20))
      .freezeWith(client);

    const tokenCreateSign = await tokenCreateTx.sign(operatorKey);
    const tokenCreateSubmit = await tokenCreateSign.execute(client);
    const tokenCreateReceipt = await tokenCreateSubmit.getReceipt(client);
    const tokenId = tokenCreateReceipt.tokenId;

    logger.info(`Token NFT créé: ${tokenId}`);

    // Métadonnées du NFT
    const metadata = {
      medicine: {
        name: medicineData.name,
        genericName: medicineData.generic_name,
        manufacturer: medicineData.manufacturer,
        category: medicineData.category,
        dosageForm: medicineData.dosage_form,
        strength: medicineData.strength
      },
      batch: {
        batchNumber: batchData.batch_number,
        manufacturingDate: batchData.manufacturing_date,
        expiryDate: batchData.expiry_date,
        quantity: batchData.quantity_manufactured,
        manufacturingLocation: batchData.manufacturing_location
      },
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    // Mint du NFT avec métadonnées
    const mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([Buffer.from(JSON.stringify(metadata))])
      .setMaxTransactionFee(new Hbar(20))
      .freezeWith(client);

    const mintTxSign = await mintTx.sign(operatorKey);
    const mintTxSubmit = await mintTxSign.execute(client);
    const mintReceipt = await mintTxSubmit.getReceipt(client);
    const serial = mintReceipt.serials[0];

    logger.info(`NFT minté - Token ID: ${tokenId}, Serial: ${serial}`);

    return {
      tokenId: tokenId.toString(),
      serial: serial.toString(),
      metadata
    };

  } catch (error) {
    logger.error('Erreur lors de la création du NFT:', error);
    throw error;
  }
}

export async function transferMedicineNFT(tokenId, serial, fromAccountId, toAccountId) {
  try {
    const transferTx = new TransferTransaction()
      .addNftTransfer(tokenId, serial, fromAccountId, toAccountId)
      .setMaxTransactionFee(new Hbar(20))
      .freezeWith(client);

    const transferTxSign = await transferTx.sign(operatorKey);
    const transferTxSubmit = await transferTxSign.execute(client);
    const transferReceipt = await transferTxSubmit.getReceipt(client);

    logger.info(`NFT transféré - Token: ${tokenId}, Serial: ${serial}`);
    
    return {
      transactionId: transferTxSubmit.transactionId.toString(),
      status: transferReceipt.status.toString()
    };

  } catch (error) {
    logger.error('Erreur lors du transfert NFT:', error);
    throw error;
  }
}

export async function getNFTInfo(tokenId, serial) {
  try {
    const nftInfo = await new TokenNftInfoQuery()
      .setNftId(tokenId, serial)
      .execute(client);

    return {
      tokenId: nftInfo.nftId.tokenId.toString(),
      serial: nftInfo.nftId.serial.toString(),
      accountId: nftInfo.accountId.toString(),
      metadata: nftInfo.metadata ? JSON.parse(nftInfo.metadata.toString()) : null,
      creationTime: nftInfo.creationTime
    };

  } catch (error) {
    logger.error('Erreur lors de la récupération des infos NFT:', error);
    throw error;
  }
}

export async function createConsensusMessage(topicId, message) {
  try {
    const messageTx = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(JSON.stringify(message))
      .setMaxTransactionFee(new Hbar(2))
      .freezeWith(client);

    const messageTxSign = await messageTx.sign(operatorKey);
    const messageTxSubmit = await messageTxSign.execute(client);
    const messageReceipt = await messageTxSubmit.getReceipt(client);

    logger.info(`Message consensus envoyé - Topic: ${topicId}`);
    
    return {
      transactionId: messageTxSubmit.transactionId.toString(),
      status: messageReceipt.status.toString()
    };

  } catch (error) {
    logger.error('Erreur lors de l\'envoi du message consensus:', error);
    throw error;
  }
}

export { client };