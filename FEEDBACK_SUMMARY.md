# Feedback Summary

Here is a quick breakdown of what was done for each of the 11 feedback points from the document:

1. **Source tables info too technical:** 
   * **Done:** We completely replaced the technical SAP table names (like `SAP.VBAK` or `SAP.LIKP`) with user-friendly terms like "Order Header Data", "Order Item Data", and "Delivery Data".
2. **Contact carrier:** 
   * **Done:** We updated the button so that clicking it directly opens the user's default email client (like Outlook) via a `mailto:` link with a pre-filled subject, allowing them to email their specific carrier contacts.
3. **Track shipment:** 
   * **Done:** We completely removed the "Track Shipment" button from all follow-up action options since it's planned for Phase 4.
4. **View invoice:** 
   * **Done:** We renamed the button to **"View Invoice (PDF)"**. In the final product, this would fetch the actual PDF from SAP. For the mockup, clicking it now shows a message explaining that it is simulating the action.
5. **Ask something else:** 
   * **Done:** We renamed this to **"Ask another question"**. When a user clicks it, it explicitly reveals the main chat input field at the bottom so the user can freely type whatever custom query they want. 
6. **Remove "In Transit" and "Delivered":** 
   * **Done:** We removed these two steps from the visual progress tracker on the order status cards. The timeline now correctly ends at "Shipped".
7. **Thumbs up/down free text box:** 
   * **Done:** We built a feedback popup modal! Now, when a user clicks the thumbs up or down icon, a modal appears with a text area asking them to provide specific comments about their rating. 
8. **Calendar pickers for time frames:** 
   * **No code change made:** For the mockup, we left these as text inputs where users can type flexibly (e.g., "June 2026"). However, you are absolutely right—in the actual production build, this will be a standard calendar picker component.
9. **Send to Sales Team outlook integration:** 
   * **Done:** Just like the Contact Carrier button, we updated "Send to Sales Team" to open the user's Outlook/email client directly so they can type in the names of the reps they want to send it to.
10. **Type Customer Name/ID:** 
   * **Done:** We updated the input fields (like in the Advanced Search prompt) to explicitly ask the user to type in the "Customer Name (Sold-to)" or Customer ID, rather than using a dropdown list. 
11. **Multiple matches for PO#:** 
   * **Done:** We built a specific scenario for this! If a user searches by PO#, the bot will simulate finding multiple orders and will prompt the user with: *"I found multiple orders matching PO... Please select the relevant one:"*, providing options that display the SAP Order #, Plant, and Ship-to so the user can make the correct choice.
