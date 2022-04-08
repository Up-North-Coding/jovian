it("should complete new user onboarding", () => {
  cy.visit("/");
  cy.contains("New User").click();
  cy.contains("Generate Wallet").click();

  // regenerate seed button should refresh the seed
  let firstSeed;
  let secondSeed;
  cy.get("textarea")
    .invoke("val")
    .then((val1) => {
      debugger;
      firstSeed = val1;
      cy.get("button").get('[aria-label="Regenerate Seed"]').click();
      cy.get("textarea")
        .invoke("val")
        .then((val2) => {
          secondSeed = val2;
          expect(val1).not.to.eq(val2);
          secondSeed = stringToWordArray(secondSeed);
        });
      cy.get("span").contains("I have backed up my seed phrase").click();

      // this is the wrong approach because i need to iterate the known words and then click the buttons in order
      cy.get(".MuiChip-label").each((value, i, item) => {
        cy.log("Chip text: " + value.text() + " index: " + i + " " + secondSeed[i]);

        if (value.text() === secondSeed[i]) item.click();
      });
    });

  // Need to iterate over a stored list of the first set of seed words
  // clicking each button in order (then perhaps going back and unclicking/reclicking a couple)
  // expect(cy.get("@firstSeedTest")).to.eq("test");
});

// wags example

// it('Current Port change', () => {
//   cy.get('#viewport').find('div[id=message]').then(message => {
//     let wags = message;
//     cy.wrap(wags).as('wags')
//   });

//   cy.get('@wags').then(wags => {
//      expect(wags).to.contain("Portsmouth")
//   });
// });

//
// Helper functions
//

function stringToWordArray(text) {
  cy.log("converting string: " + text);
  return text.split(" ");
}
