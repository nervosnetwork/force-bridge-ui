Feature: Bridge history

  Scenario: After bridging 1 ETH to Nervos
    When I click "Bridge" button to bridge 1 ETH from Ethereum to Nervos
    Then I should see a record on "Pending History":
      | From  | To      |
      | 1 ETH | 1 ckETH |

    When I click on the "＋" icon on the left of the list
    Then I should see:
      | 1. lock asset on Ethereum |

    When I click "lock asset on Ethereum"
    Then the page should redirect to "etherscan" to explore the transaction

    When the lock transaction achieved confirmation block
    Then I should see
      | 1. lock asset on Ethereum |
      | 2. mint asset on Nervos   |

    When I click "2. mint asset on Nervos"
    Then the page should redirect to "explorer.nervos.org" to explore the transaction

    When the lock transaction was confirmed
    Then the lock transaction should disappeared on "Pending History"

    When I click "Succeed History"
    Then I should see:
      | From  | To      |
      | 1 ETH | 1 ckETH |
