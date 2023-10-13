// META: script=/resources/testdriver.js
// META: script=/common/utils.js
// META: script=resources/fledge-util.sub.js
// META: timeout=long

"use strict;"

async function fetchDirectFromSellerSignals(headers_content) {
  let response = await fetch(createDirectFromSellerSignalsURL(),
    { adAuctionHeaders: true, headers: headers_content });

  if (!('Negative-Test-Option' in headers_content)) {
    assert_equals(response.status,
      200,
      'Failed to fetch directFromSellerSignals: ' + await response.text());
    assert_false(response.headers.has('Ad-Auction-Signals'),
      'Header \"Ad-Auction-Signals\" should be hidden from documents.');
  }
}

function directFromSellerSignalsValidatorCode(uuid, expectedSellerSignals,
  expectedAuctionSignals, expectedPerBuyerSignals) {
  return {
    scoreAd:
      `if (directFromSellerSignals === null ||
           directFromSellerSignals.sellerSignals !== ${expectedSellerSignals} ||
           directFromSellerSignals.auctionSignals !== ${expectedAuctionSignals} ||
           Object.keys(directFromSellerSignals).length != 2) {
        throw "Failed to get expected directFromSellerSignals in scoreAd(): " + JSON.stringify(directFromSellerSignals);
      }`,
    reportResultSuccessCondition:
      `directFromSellerSignals !== null &&
       directFromSellerSignals.sellerSignals === ${expectedSellerSignals} &&
       directFromSellerSignals.auctionSignals === ${expectedAuctionSignals} &&
       Object.keys(directFromSellerSignals).length == 2`,
    reportResult:
      `sendReportTo('${createSellerReportURL(uuid)}');`,
    generateBid:
      `if (directFromSellerSignals === null ||
           directFromSellerSignals.perBuyerSignals !== ${expectedPerBuyerSignals} ||
           directFromSellerSignals.auctionSignals !== ${expectedAuctionSignals} ||
           Object.keys(directFromSellerSignals).length != 2) {
        throw "Failed to get expected directFromSellerSignals in generateBid(): " + JSON.stringify(directFromSellerSignals);
        }`,
    reportWinSuccessCondition:
      `directFromSellerSignals !== null &&
         directFromSellerSignals.perBuyerSignals === ${expectedPerBuyerSignals} &&
         directFromSellerSignals.auctionSignals === ${expectedAuctionSignals} &&
         Object.keys(directFromSellerSignals).length == 2`,
    reportWin:
      `sendReportTo('${createBidderReportURL(uuid)}');`
  }
}

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, null, null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot/0"
  );
}, 'Test directFromSellerSignals with empty Ad-Auction-Signals header.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, '\'sellerSignals/1\'', null, null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot/1"
  );
}, 'Test directFromSellerSignals with only sellerSignals.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, '\'auctionSignals/2\'', null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot/2"
  );
}, 'Test directFromSellerSignals with only auctionSignals.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, null, '\'perBuyerSignals/3\''),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot/3"
  );
}, 'Test directFromSellerSignals with only perBuyerSignals.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, '\'sellerSignals/4\'', '\'auctionSignals/4\'', '\'perBuyerSignals/4\''),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot/4"
  );
}, 'Test directFromSellerSignals with sellerSignals, auctionSignals and perBuyerSignals.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, '\'sellerSignals/5\'', '\'auctionSignals/5\'', null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot/5"
  );
}, 'Test directFromSellerSignals with mismatched perBuyerSignals.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, null, null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot/non-exist"
  );
}, 'Test directFromSellerSignals with non-existed adSlot.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, null, null),
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    null
  );
}, 'Test directFromSellerSignals with null directFromSellerSignalsHeaderAdSlot.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Buyer-Origin': window.location.origin });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, null, null),
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
  );
}, 'Test directFromSellerSignals with no directFromSellerSignalsHeaderAdSlot.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Negative-Test-Option': 'HTTP Error' });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, null, null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot"
  );
}, 'Test directFromSellerSignals with HTTP error.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Negative-Test-Option': 'No Ad-Auction-Signals Header' });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, null, null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot"
  );
}, 'Test directFromSellerSignals with no returned Ad-Auction-Signals Header.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Negative-Test-Option': 'Invalid Json' });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, null, null, null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot"
  );
}, 'Test directFromSellerSignals with invalid json in Ad-Auction-Signals header.');

promise_test(async test => {
  const uuid = generateUuid(test);
  await fetchDirectFromSellerSignals({ 'Negative-Test-Option': 'Network Error' });
  await runReportTest(
    test, uuid,
    directFromSellerSignalsValidatorCode(uuid, '\'sellerSignals\'', '\'auctionSignals\'', null),
    // expectedReportUrls
    [createSellerReportURL(uuid), createBidderReportURL(uuid)],
    // renderURLOverride
    null,
    // directFromSellerSignalsHeaderAdSlot
    "adSlot"
  );
}, 'Test directFromSellerSignals with network error.');
