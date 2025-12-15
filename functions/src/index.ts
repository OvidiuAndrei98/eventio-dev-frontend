/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {onRequest} from "firebase-functions/v2/https";
import {Resend} from "resend";
import Stripe from "stripe";

initializeApp();

export const updateUserAfterSuccesfulPayment = onDocumentCreated(
  "customers/{userId}/payments/{paymentId}",
  async (event) => {
    const {userId} = event.params;
    if (!event.data) {
      logger.error("No data found in the document.");
      return;
    }

    const data = event.data.data();
    if (!data) {
      logger.error("No data found in the document.");
      return;
    }

    if (data.error) {
      logger.error(`An error occurred: ${data.error.message}`);
      return;
    }

    // Extract eventId and newPlan from metadata
    const eventId = data.metadata?.eventId;
    const newPlan = data.metadata?.newPlan;

    if (data.status === "succeeded" && eventId && newPlan) {
      try {
        await admin
          .firestore()
          .collection("events")
          .doc(eventId)
          .update({eventPlan: newPlan});

        logger.info(
          `Event ${eventId} updated to plan ${newPlan} for user ${userId}.`
        );
      } catch (error) {
        logger.error("Error updating Firestore:", error);
      }
    } else {
      logger.info(
        "No update needed. Missing eventId/newPlan or status not succeeded."
      );
    }
  }
);
export const handleStripeWebhook = onRequest(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2025-06-30.basil",
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err: unknown) {
    const error = err as Error;
    logger.error("Webhook signature verification failed.", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.client_reference_id === "planner") {
      try {
        const customerEmail = session.customer_details?.email;
        if (!customerEmail) {
          logger.error("Customer email is missing in the checkout session.");
          res.status(400).send("Customer email is missing.");
          return;
        }

        const filePath = "Planyvite/Planyvite-Planner-nuntă.xlsm";

        const options = {
          action: "read" as const,
          expires: "01-01-2100",
        };

        const bucket = admin.storage().bucket();
        const file = bucket.file(filePath);
        const [downloadUrl] = await file.getSignedUrl(options);

        const emailHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="ro">
<head>
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:#f6f9fc;
  font-family:-apple-system,BlinkMacSystemFont,
  'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif">
  <div style="display:none;overflow:hidden;
    line-height:1px;opacity:0;max-height:0;
    max-width:0" data-skip-in-text="true">
    Mulțumim pentru comanda ta! Planificatorul tău digital este aici.
  </div>
  <table align="center" width="100%" border="0"
    cellpadding="0" cellspacing="0"
    role="presentation" style="max-width:37.5em;
    background-color:#fff;margin:0 auto;
    padding:20px 0 48px;margin-bottom:64px">
    <tbody>
  <tr style="width:100%">
    <td>
  <table align="center" width="100%" border="0"
    cellpadding="0" cellspacing="0"
    role="presentation" style="padding:0 48px">
    <tbody>
  <tr>
    <td>
  <img alt="Planyvite Logo" height="30" 
    src="https://firebasestorage.googleapis.com/v0/b/planyvite-18d36.firebasestorage.app/o/Planyvite%2Fplanyvite_logo_png.png?alt=media&token=94fb27ab-22a6-486d-93c3-7cc26287e1e6" 
    style="display:block;outline:none;border:none;text-decoration:none" />
  <hr style="width:100%;border:none;border-top:1px solid #eaeaea;
    border-color:#e6ebf1;margin:20px 0" />
  <p style="font-size:16px;line-height:24px;color:#525f7f;
    text-align:left;margin-top:16px;margin-bottom:16px">
    Salut,
  </p>
  <p style="font-size:16px;line-height:24px;color:#525f7f;
    text-align:left;margin-top:16px;margin-bottom:16px">
    Mulțumim pentru achiziția ta! Planificatorul tău digital este
    gata și te așteaptă. Apasă butonul de mai jos pentru a-l
    descărca.
  </p>
  <a href="[!!! ÎNLOCUIEȘTE CU LINK-UL TĂU DE DESCĂRCARE !!!]"
    style="line-height:100%;text-decoration:none;display:block;
    max-width:100%;mso-padding-alt:0px;background-color:#b46acb;
    border-radius:5px;color:#fff;font-size:16px;font-weight:bold;
    text-align:center;padding:12px"
    target="_blank">
    <span></span>
    <span style="max-width:100%;display:inline-block;line-height:120%;
      mso-padding-alt:0px;mso-text-raise:7.5px">
      Descarcă Planificatorul
    </span>
    <span></span>
  </a>
   <p style="font-size:16px;line-height:24px;color:#525f7f;
   text-align:left;margin-top:24px;margin-bottom:16px">
    Sperăm să te ajute să fii mai organizat(ă) și productiv(ă).
  </p>
  
  <hr style="width:100%;border:none;
  border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
  <p style="font-size:16px;line-height:24px;
  color:#525f7f;text-align:left;margin-top:16px;margin-bottom:16px">
    <b>Știai că Planyvite te ajută și cu evenimentele speciale?</b>
  </p>
  <p style="font-size:16px;line-height:24px;
  color:#525f7f;text-align:left;margin-top:16px;margin-bottom:16px">
    Pe lângă unelte de planificare, platforma noastră îți permite să
     creezi <b>invitații digitale interactive</b>
    pentru nunți, botezuri sau orice altă ocazie. Gestionează
     confirmările de prezență (RSVP) în timp real și 
    impresionează-ți invitații cu un design modern.
  </p>
  <p style="font-size:16px;line-height:24px;color:#525f7f;
  text-align:left;margin-top:16px;margin-bottom:16px">
    <a
      href="https://planyvite.ro"
      style="color:#556cd6;text-decoration-line:none"
      target="_blank"
      >Descoperă platforma de invitații aici &rarr;</a>
  </p>
  <hr style="width:100%;border:none;
  border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
  <p style="font-size:16px;line-height:24px;color:#525f7f;
    text-align:left;margin-top:16px;margin-bottom:16px">
    Dacă ai întrebări sau ai nevoie de ajutor, ne poți răspunde
    direct la acest email. Suntem aici să te ajutăm!
  </p>
  <p style="font-size:16px;line-height:24px;color:#525f7f;
    text-align:left;margin-top:16px;margin-bottom:16px">
    O zi productivă,<br />
    — Echipa Planyvite
  </p>
  <hr style="width:100%;border:none;border-top:1px solid #eaeaea;
    border-color:#e6ebf1;margin:20px 0" />
  <p style="font-size:12px;line-height:16px;color:#8898aa;
    margin-top:16px;margin-bottom:16px">
    Planyvite.ro &copy; 2025. Toate drepturile rezervate.
  </p>
    </td>
  </tr>
    </tbody>
  </table>
    </td>
  </tr>
    </tbody>
  </table>
</body>
</html>
`;

        const finalEmailHtml = emailHtml.replace(
          "[!!! ÎNLOCUIEȘTE CU LINK-UL TĂU DE DESCĂRCARE !!!]",
          downloadUrl
        );

        logger.info(`Sending product email to: ${customerEmail}`);

        const {data, error} = await resend.emails.send({
          from: "contact@planyvite.ro",
          to: customerEmail,
          subject: "Planificatorul tău digital de la Planyvite este aici!",
          html: finalEmailHtml,
          text: `Mulțumim pentru achiziție!
         Descarcă planificatorul tău aici: ${downloadUrl}`,
        });

        if (error) {
          res.status(400).json(error);
          return;
        }

        res.status(200).send(data);
        // Query the customers collection by stripeId and update the email
        const customersRef = admin.firestore().collection("customers");
        const querySnapshot = await customersRef
          .where("stripeId", "==", session.customer as string)
          .get();

        if (!querySnapshot.empty) {
          const batch = admin.firestore().batch();
          querySnapshot.forEach((doc) => {
            batch.update(doc.ref, {email: customerEmail});
          });
          await batch.commit();
        }

        return;
      } catch (err: unknown) {
        const error = err as Error;
        logger.error(
          "Error processing checkout.session.completed event:",
          error
        );
        res.status(500).send(`Error: ${error.message}`);
        return;
      }
    }
    if (session.payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string
        );

        const purchaseType = paymentIntent.metadata.purchaseType;
        const eventId = paymentIntent.metadata.eventId;

        if (purchaseType === "table-plan-upgrade") {
          console.log("Upgrade plan detected. Processing user activation...");

          await admin
            .firestore()
            .collection("users")
            .doc(session.client_reference_id as string)
            .update({planEventUltimateLicense: true});

          await admin
            .firestore()
            .collection("tablePlanEvents")
            .doc(eventId as string)
            .update({eventPlan: "ultimate"});
        } else {
          console.log("Purchase type not found or is a different product.");
        }
      } catch (error) {
        console.error("Error retrieving Payment Intent:", error);
      }
    }
  } else {
    res.status(200).send("Event type not handled");
    return;
  }
});
