Feature: Bridge operation form

  Background:
    Given I am on the "Ethereum -> Nervos" bridge page
    And I have connected the "Alice" account into MetaMask:
      | name  | pk                                                                 | address_eth                                | address_ckb                                                                                     |
      | Alice | 0x1111111111111111111111111111111111111111111111111111111111111111 | 0xFeE2F3b8597B67C57dA0AFA943B15d5eabBBa2B4 | ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx8lhz7wu9j7m8c476ptafgwc46h4thw3tg8cyspx |
    And "Alice" holding the Ethereum assets:
      | asset | amount |
      | ETH   | 1.5    |
      | USDC  | 0.5    |
    And "Alice" holding the shadow assets:
      | asset  | amount |
      | ckETH  | 0.6    |
      | ckUSDT | 2.2    |

  Scenario: Balance modal
    When I press the "select" button
    Then I should see the balance modal:
      | asset | amount |
      | ETH   | 1.5    |
      | USDT  | 0      |
      | DAI   | 0      |
      | USDC  | 0.5    |

    When I select the "ETH"
    Then The balance modal should be closed
    And "ETH" should be selected
    And Max label should be "1.5"
    And "To" asset should be changed to "ckETH"

  Scenario: Bridging the ETH
    Given "ETH" was selected
    When I typed "0.1" in "From"
    Then "Bridge" button status should be changed from "disabled" to "non-disabled"
    And "Fee" should be "0.000001"
    And "To" should be "0.099999"

    When I press "Bridge" button
    Then MetaMask should pop up a window and ask me if I want to transfer "ETH"

    When I click "Confirm" in MetaMask popup
    Then MetaMask should be closed
    And I should see the "Bridge Tx Sent" modal with a transaction id

    When I click the "explorer" link
    Then The page should redirect to "etherscan" to explore the transaction
    And I should see a pending transaction indicating that I have locked ETH into the contract

  Scenario: Approve an ERC20
    Given "USDC" is the first time to bridge to "Nervos"
    And "USDC" is selected

    When I typed "0.004" in "From"
    Then I should see the "Bridge" button changed to "Approve" button

    When I click the "Approve" button
    Then MetaMask should pop up a window and ask me if I want to approve "USDC"

    When I click "Confirm" in MetaMask popup
    Then I should see "Approve Tx Sen" modal with a transaction id

    When I click the "explorer" link
    Then the page should redirect to "etherscan" to explore the transaction
    And I should see a pending transaction indicating that I have approved "USDC" to the contract

  Scenario Outline: Attempt to input a wrong from amount
    Given I have "0.5" USDC
    And "USDC" is selected
    When I typed <amount> to From
    Then I should see <message>
    And the "Bridge" button should be disabled

    Examples:
      | amount     | message                                  |
      | 999999999  | balance is insufficient                  |
      | 0          | bridge in amount should large than 0     |
      | 0.000001   | minimal bridge amount is 0.001 USDC      |
      | 0.00000003 | max decimal places should be less than 6 |

  Scenario Outline: Attempt to input a wrong recipient
    When I typed <recipient> to "To"
    Then I should see <message>

    Examples:
      | recipient                                                                                         | message                |
      | ckt1q3vv33                                                                                        | recipient is not valid |
      | ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx8lhz7wu9j7m8c476ptafgwc46h4thw3tg8cyspx00 | recipient is not valid |
      | 0xFeE2F3b8597B67C57dA0AFA943B15d5eabBBa2B4                                                        | recipient is not valid |
