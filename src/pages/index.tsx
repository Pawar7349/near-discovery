import { Card, Flex, Grid, Section, Tabs, Text } from '@near-pagoda/ui';
import { Globe, Link, MagnifyingGlass, Scroll } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ChainAbstraction } from '@/components/home/ChainAbstraction';
import { Contracts } from '@/components/home/Contracts';
import { Data } from '@/components/home/Data';
import { DecentralizedApps } from '@/components/home/DecentralizedApps';
import useDeviceType from '@/hooks/useDeviceType';
import { useDefaultLayout } from '@/hooks/useLayout';
import type { NextPageWithLayout } from '@/utils/types';

export interface NearBlocks {
  avg_block_time: string;
  gas_price: string;
  near_price: string;
  total_txns: string;
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  background-size: 54px;
  padding: 16px 0px;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGeSURBVHgB7doxTisxEAbgeY/mvQro6NiSDo6QkpJbcA2OwjWooKQMJ2DpKENJBV7FEYoBeQSIZr9PGk2cItWvsdfZnSBjKHVf6rnUbdD1N8g4K7VX6jhIEaycofaTIEWwcoam0yFYOYe179WiQ7Byhk8+8wnB6munlHNWgmD1tUGyFSYIVl8bJFcOCYLV106s/aBrJ2hNE+qo1GmpRanz2J5aB6X+x/oQv/l+FWz5E/O1iHU4pom0W/u0/uoZahnrgN2VGuv6Jpidl1+o2T5BznkrfKj9MdZT6l9836r+3k2pq1KXMVNz3gpbU7hOmj49AQ7x/lJ0WWsK5xhv2+AYkHQR29vbddDluqFvbNZPQZdg9S07az4gWH3tHZVgJQhW3xjb4XIZyo+Z3nffHN79CZ1gYuXc1b4KEytFsHLGptMhWDlj7Q9BimDlbJ4Ex4AftggHdwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIpXoUVLSWulnzoAAAAASUVORK5CYII=');
`;

const StyledCard = ({ href, title, description }: { href: string; title: string; description: string }) => {
  return (
    <Card style={{ padding: '2rem 1rem', border: 0, textDecoration: 'none' }} href={href}>
      <Text as="h4"> {title} </Text>
      <Text>{description}</Text>
    </Card>
  );
};

const NewsletterBanner = styled.div`
  background-color: #0072ce;
  color: white;
  padding: 8px;
  text-align: center;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  @media (max-width: 1240px) {
    top: 60px;
  }
`;

const HomePage: NextPageWithLayout = () => {
  const [selectedTab, setTab] = useState('contracts');
  const [avgBlockTime, setAvgBlockTime] = useState('1.30');
  const [avgTxPrice, setAvgTxPrice] = useState('0.01');
  const [totalTx, setTotalTx] = useState('2,33');
  const [nearStats, setNearStats] = useState<NearBlocks>();
  const deviceType = useDeviceType();

  useEffect(() => {
    fetch('https://api.nearblocks.io/v1/stats')
      .then((response) => response.json())
      .then((data) => {
        if (!data.stats) return;
        data = data.stats[0];
        setNearStats(data);
        setTotalTx((Number(data.total_txns) / 1_000_000_000).toFixed(2));
        setAvgBlockTime(data.avg_block_time.slice(0, 4));
      });
  }, []);

  useEffect(() => {
    if (!nearStats) return;

    const getAvrTx = async () => {
      const feesResponse = await fetch('https://pikespeak.ai/api/live/last-txs-fees');
      const feesData = await feesResponse.json();

      const averageFee = (feesData * Number(nearStats.near_price)).toFixed(3);
      setAvgTxPrice(averageFee);
    };
    getAvrTx();
  }, [nearStats]);

  return (
    <Section grow="available">
      <NewsletterBanner>
        Stay updated!{' '}
        <a href="https://bit.ly/devhubnews" style={{ color: 'white', textDecoration: 'underline' }}>
          Sign up for our newsletter →
        </a>
      </NewsletterBanner>
      <Flex stack gap="l" style={{ padding: deviceType === 'mobile' ? '0' : '0 var(--gap-l)' }}>
        <Header>
          <Flex stack gap="s" style={{ backgroundColor: 'white', padding: '1rem', textAlign: 'center' }}>
            <Text as="h1"> NEAR Developer Portal </Text>
            <Text> Embrace the power of Web3 </Text>
          </Flex>
        </Header>

        <Card style={{ padding: '.5rem 1.5rem 1rem 1.5rem', marginTop: '2rem', border: 0 }}>
          <Tabs.Root value={selectedTab} style={{ minHeight: '768px' }}>
            <Tabs.List style={{ marginBottom: '1rem' }}>
              <Tabs.Trigger
                onClick={() => {
                  setTab('contracts');
                }}
                value="contracts"
              >
                <Scroll fill="bold" />
                Smart Contracts
              </Tabs.Trigger>

              <Tabs.Trigger
                onClick={() => {
                  setTab('chain-abstraction');
                }}
                value="chain-abstraction"
              >
                <Link fill="bold" />
                Chain Abstraction
              </Tabs.Trigger>

              <Tabs.Trigger
                onClick={() => {
                  setTab('web3-apps');
                }}
                value="web3-apps"
              >
                <Globe fill="bold" />
                Web3 Apps
              </Tabs.Trigger>

              <Tabs.Trigger
                onClick={() => {
                  setTab('data-solutions');
                }}
                value="data-solutions"
              >
                <MagnifyingGlass fill="bold" />
                Data Solutions
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="contracts" style={{ flex: 1 }}>
              <Contracts />
            </Tabs.Content>

            <Tabs.Content value="chain-abstraction" style={{ flex: 1 }}>
              <ChainAbstraction />
            </Tabs.Content>

            <Tabs.Content value="web3-apps" style={{ flex: 1 }}>
              <DecentralizedApps />
            </Tabs.Content>

            <Tabs.Content value="data-solutions" style={{ flex: 1 }}>
              <Data />
            </Tabs.Content>
          </Tabs.Root>
        </Card>

        <Header style={{ marginTop: 'var(--gap-xl)', textAlign: 'center' }}>
          <Flex stack gap="l" align="center">
            <Text as="h1" style={{ maxWidth: '470px', textAlign: 'center', backgroundColor: 'white' }}>
              Why choose NEAR?
            </Text>

            <Grid columns="1fr 1fr 1fr 1fr" gap="xl" columnsTablet="1fr">
              <Card style={{ padding: '1.5rem 1rem', border: 0 }}>
                <Text as="h2"> {totalTx} B + </Text>
                <Text> Transactions </Text>
              </Card>

              <Card style={{ padding: '1.5rem 1rem', border: 0 }}>
                <Text as="h2"> {avgBlockTime} s </Text>
                <Text> Avg. Block Time </Text>
              </Card>

              <Card style={{ padding: '1.5rem 1rem', border: 0 }}>
                <Text as="h2"> $ {avgTxPrice} </Text>
                <Text> Avg. Txn. Price</Text>
              </Card>

              <Card style={{ padding: '1.5rem 1rem', border: 0 }}>
                <Text as="h2"> 500 + </Text>
                <Text> Awesome Apps </Text>
              </Card>
            </Grid>
          </Flex>
        </Header>

        <Text as="h1" style={{ marginTop: 'var(--gap-xl)' }}>
          Resources
        </Text>

        <Grid columns="1fr 1fr 1fr" gap="xl" style={{ textAlign: 'center' }} columnsTablet="1fr">
          <StyledCard
            href="/documentation"
            title="📖 Documentation"
            description="Find all the documentation, examples and tutorials you need to get started with Near"
          />
          <StyledCard
            href="/contact-us"
            title="💬 Support"
            description="Reach out to our community and get support with any questions or issues"
          />
          <StyledCard
            href="/tools"
            title="🧰 Toolbox"
            description="Explore a collection of tools and resources to enhance your Near development experience"
          />
          <StyledCard
            href="/applications"
            title="🌐 Awesome Apps"
            description="Discover innovative apps built on Near, showcasing the power of decentralized technology"
          />
          <StyledCard
            href="/events"
            title="🗓️ Events"
            description="Join us at conferences, meetups, and workshops to connect with the Near community worldwide"
          />
        </Grid>
      </Flex>
    </Section>
  );
};

HomePage.getLayout = useDefaultLayout;

export default HomePage;
