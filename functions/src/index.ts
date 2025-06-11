/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

export const updateUserAfterSuccesfulPayment = onDocumentCreated(
  'customers/{userId}/payments/{paymentId}',
  async (event) => {
    const { userId } = event.params;
    if (!event.data) {
      logger.error('No data found in the document.');
      return;
    }

    const data = event.data.data();
    if (!data) {
      logger.error('No data found in the document.');
      return;
    }

    if (data.error) {
      logger.error(`An error occurred: ${data.error.message}`);
      return;
    }

    // Extrage eventId și newPlan din metadata
    const eventId = data.metadata?.eventId;
    const newPlan = data.metadata?.newPlan;

    if (data.status === 'succeeded' && eventId && newPlan) {
      try {
        await admin
          .firestore()
          .collection('events')
          .doc(eventId)
          .update({ eventPlan: newPlan });

        logger.info(
          `Event ${eventId} updated to plan ${newPlan} for user ${userId}.`
        );
      } catch (error) {
        logger.error('Error updating Firestore:', error);
      }
    } else {
      logger.info(
        'No update needed. Missing eventId/newPlan or status not succeeded.'
      );
    }
  }
);

export const updateEventStatisticsAfterResponse = onDocumentCreated(
  'guest_registry/{guestId}',
  async (event) => {
    const { guestId } = event.params;
    if (!event.data) {
      logger.error('No data found in the document.');
      return;
    }

    const data = event.data.data();
    if (!data) {
      logger.error('No data found in the document.');
      return;
    }

    const eventId = data.eventId;
    if (!eventId) {
      logger.error('No eventId found in the document.');
      return;
    }

    try {
      const eventDocRef = admin.firestore().collection('events').doc(eventId);
      const eventDoc = await eventDocRef.get();

      if (!eventDoc.exists) {
        logger.error(`Event with ID ${eventId} does not exist.`);
        return;
      }

      const eventData = eventDoc.data();
      if (!eventData) {
        logger.error(`No data found for event with ID ${eventId}.`);
        return;
      }

      // Update statistics based on the response
      // This is a placeholder for your logic to update statistics
      // For example, you might want to increment counters based on the response type

      logger.info(`Statistics updated for event ${eventId} after response.`);
    } catch (error) {
      logger.error('Error updating Firestore:', error);
    }
  }
);
