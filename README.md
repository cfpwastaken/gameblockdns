# GameBlockDNS

Blocks games using a DNS Sinkhole.

This is useful for schools.

## Installation

You simply need to add the blocklist url to your filter:

Domainlist: https://raw.githubusercontent.com/cfpwastaken/gameblockdns/main/origins.txt
AdGuard (blocks subdomains too): https://raw.githubusercontent.com/cfpwastaken/gameblockdns/main/adguard.txt

## How does this work?

This works by blocking the DNS requests to the game servers. This means that the game will not be able to connect to the server and will not be able to play.

We automatically collect game websites using the [DuckDuckGo](https://duckduckgo.com) search engine.

DuckDuckGo is a search engine that does not track you and does not collect your data.

We request the DuckDuckGo API with search queries such as "games free", "games unblocked", "cookie clicker online" and so on. Additionally, if DuckDuckGo shows "releated searches" we also request those.

We then extract all the domains from the results and add them to the blocklist if they are not already in it.

An AdGuard Home blocklist is automatically generated from the domains, which also blocks all subdomains. Therefore we recommend using AdGuard Home as your DNS Sinkhole.
