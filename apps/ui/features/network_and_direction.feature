Feature: Network and direction

  Background:
    Given I am on the "Ethereum -> Nervos" bridge page
    And I have connected to the "Alice" account:
      | name  | pk                                                                 | address_eth                                | address_ckb                                                                                     |
      | Alice | 0x1111111111111111111111111111111111111111111111111111111111111111 | 0xFeE2F3b8597B67C57dA0AFA943B15d5eabBBa2B4 | ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx8lhz7wu9j7m8c476ptafgwc46h4thw3tg8cyspx |

  Scenario: Switch the direction with dropdown at the top
    Given "ETH" asset was selected
    When I select direction to "Nervos -> Ethereum"
    Then I should see address change to "ckt1q3vvta...w3tg8cyspx"
    And the URL should be "/bridge/Nervos/Ethereum"
    And sleected asset should be changed to "ckETH"
