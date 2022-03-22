import { Box, Text, VStack } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { RiLinkUnlinkM } from 'react-icons/ri';
import { SatoshiIcon } from '../../../components/icons';
import { CircularFundProgress } from '../../../components/molecules';
import { IdBar } from '../../../components/molecules/IdBar';
import { ButtonComponent, FundingStatus } from '../../../components/ui';
import {getCountDown, isMobileMode } from '../../../utils';
import { Button } from '@chakra-ui/react';

import { useStyles } from './styles';
import { IProject, IProjectFunding } from '../../../interfaces';

interface IInfoPage {
    project: IProject;
    handleFundClick: () => void;
    handleFundProject: () => void;
    loading: boolean;
    btcRate: number;
    fundingTxs: IProjectFunding[]
}

export const InfoPage = ({
	handleFundClick,
	handleFundProject,
	loading,
	project,
	btcRate,
	fundingTxs,
}: IInfoPage) => {
	console.log('FUNDERS: ', fundingTxs);
	const isMobile = isMobileMode();
	const classes = useStyles({isMobile});

	const [countDown, setCountDown] = useState('');
	const [copy, setCopy] = useState(false);

	const handleCountDown = () => {
		const countDown = getCountDown(project.expiresAt);
		setCountDown(countDown);
	};

	useEffect(() => {
		const interval = setInterval(handleCountDown, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [project.expiresAt]);

	const shareProjectWithfriends = () => {
		navigator.clipboard.writeText(window.location.href);
		setCopy(true);
		setTimeout(() => {
			setCopy(false);
		}, 5000);
	};

	return (
		<VStack
			padding={isMobile ? '10px 5px 0px 5px' : '10px 20px'}
			spacing="12px"
			width="100%"
			height="100%"
			overflowY="hidden"
			position="relative"
		>
			{isMobile && <Button className={classes.fundButton} onClick={handleFundClick}>
				<Text fontSize="12px">Project</Text>
			</Button>}
			<FundingStatus open={true} />
			<CircularFundProgress loading={loading} rate={btcRate} goal={project.fundingGoal} amount={project.balance} />
			<Text>{`COUNTDOWN: ${countDown}`}</Text>
			<ButtonComponent
				primary
				standard
				leftIcon={<SatoshiIcon />}
				width="100%"
				onClick={handleFundProject}
			>
				Fund this project
			</ButtonComponent>
			<ButtonComponent
				standard
				primary={copy}
				leftIcon={copy ? <RiLinkUnlinkM /> : <HiOutlineSpeakerphone fontSize="20px" />}
				width="100%"
				onClick={shareProjectWithfriends}
			>
				{copy ? 'Project Link Copied' : 'Share project with friends'}
			</ButtonComponent>
			<Box width="100%" display="flex" flexDirection="column" alignItems="start" overflow="hidden" flex="1">
				<Text fontSize="16px" marginBottom="10px" marginTop="10px">
					{`Project Backers ${fundingTxs.length ? `( ${fundingTxs.length} )` : ''}`}
				</Text>
				<VStack spacing={'8px'} width="100%" overflow="auto" height={isMobile ? 'calc(100% - 44px)' : '100%'} paddingBottom="10px">
					{
						fundingTxs.map((fundingTx, index) => (
							<IdBar key={index} fundingTx={fundingTx} />
						))
					}
				</VStack>
			</Box>
		</VStack>
	);
};
