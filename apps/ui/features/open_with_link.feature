Feature: Open with link

  Scenario: Open with default page
    When I open with the URL "/"
    Then I should go to "bridge" page
    And The direction selector should shows from "Ethereum" to "Nervos"

  Scenario: Go directly to Nervos -> Eth
    When I open with the URL "/bridge/Nervos/Ethereum"
    Then I should go to "bridge" page
    And The direction selector should shows from "Nervos" to "Ethereum"

  Scenario: To the bridge page with auto-filled form
    Given I have connected wallet
    When I open with the URL "/bridge/Ethereum/Nervos?xchain-asset=0x0000000000000000000000000000000000000000&amount=1.2&recipient=ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx8mlhhgshgqe2hq2lsddc6sk5gq6z9hdjjpskcqf"
    Then I should go to "bridge" page
    And URL should change to "/bridge/Ethereum/Nervos?xchain-asset=0x0000000000000000000000000000000000000000"
    And The "ETH" should be selected
    And "From" should be filled with "1.2"
    And "Recipient" should be filled with "ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx8mlhhgshgqe2hq2lsddc6sk5gq6z9hdjjpskcqf"
