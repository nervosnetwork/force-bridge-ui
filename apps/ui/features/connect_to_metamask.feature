Feature: Connect to MetaMask

  Background:
    Given I have installed MetaMask
    And I am on the "Ethereum -> Nervos" bridge page
    And I have switch to the Rinbeky network
    And I have imported my accounts into MetaMask:
      | name  | pk                                                                 | address                                    |
      | Alice | 0x1111111111111111111111111111111111111111111111111111111111111111 | 0xFeE2F3b8597B67C57dA0AFA943B15d5eabBBa2B4 |
      | Bob   | 0x2222222222222222222222222222222222222222222222222222222222222222 | 0x1563915e194D8CfBA1943570603F7606A3115508 |

  Scenario: The First time connect to the MetaMask
    When I press the "Connect a Wallet To Start" button
    And I choose to connect to "Alice" account
    Then I should see address "0xfee2f3b8...5eabbba2b4" of "Alice"

  Scenario: Automatic connect to the MetaMask
    Given I have connected to the "Alice" account
    Then I re-enter to the page
    Then I should see address "0xfee2f3b8...5eabbba2b4" of "Alice"

  Scenario: Sync connected account with MetaMask
    Given I have connected to the "Alice" account
    Then I switch MetaMask connected account to "Bob"
    And I should see address "0x1563915e...A3115508" of "Bob"

  Scenario: Disconnect part of the account
    Given I have connected to the "Alice" account and "Bob" account
    And "Alice" account is connecting
    Then I disconnect the "Alice" account
    Then I should see the address "0x1563915e...A3115508" of "Bob"

