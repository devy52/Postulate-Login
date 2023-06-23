import React from "react";
import theme from "theme";
import { Theme, Link, Text, List, Box, Section, Input, Structure } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml, Override } from "@quarkly/components";
export default (() => {
	return <Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"index"} />
		<Helmet>
			<title>
				Quarkly export
			</title>
			<meta name={"description"} content={"Web site created using quarkly.io"} />
			<link rel={"shortcut icon"} href={"https://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
		</Helmet>
		<Section padding="0px 0 0px 0">
			<Box
				display="flex"
				padding="12px 0"
				justify-content="space-between"
				align-items="center"
				flex-direction="row"
				md-flex-direction="column"
			>
				<Text margin="0" md-margin="0px 0 20px 0" text-align="left" font="normal 900 50px/1.5 --fontFamily-googleTeko">
					JOURNEY DIARIES
				</Text>
				<Link href="#" color="#000000" />
				<List
					margin="0px 0px 0px 0px"
					padding="0px 0px 0px 20px"
					as="ul"
					list-style-type="none"
					flex="0 1 auto"
					order="1"
					display="flex"
				>
					<Link
						href="#"
						color="#000000"
						padding="8px 12px 6px 12px"
						text-decoration-line="initial"
						display="flex"
						font="30px/30px --fontFamily-googleTeko"
						hover-color="--lightD2"
						transition="background-color 0.1s ease 0s"
					>
						Home
					</Link>
					<Link
						href="#"
						color="#000000"
						padding="8px 12px 6px 12px"
						text-decoration-line="initial"
						display="flex"
						font="30px/30px --fontFamily-googleTeko"
						hover-color="--lightD2"
						transition="background-color 0.1s ease 0s"
					>
						About
					</Link>
					<Link
						href="#"
						color="white"
						padding="6px 12px 6px 12px"
						text-decoration-line="initial"
						display="flex"
						font="30px/30px --fontFamily-googleTeko"
						hover-color="--lightD2"
						transition="background-color 0.1s ease 0s"
						background="#3468d3"
						border-style="solid"
						border-width="2px"
						hover-background="#898c96"
					>
						LOGIN
					</Link>
				</List>
			</Box>
		</Section>
		<Section background="--color-darkL2" padding="60px 0" sm-padding="40px 0">
			<Box margin="-16px -16px -16px -16px" padding="16px 16px 16px 16px" display="flex" flex-wrap="wrap">
				<Box padding="16px 16px 16px 16px" width="50%" lg-width="100%">
					<Box
						background="url(https://wallpaperaccess.com/full/1905877.jpg) 20% 15%/cover"
						padding="0px 0px 672px 0px"
						margin="0px -112px 0px 0px"
						lg-margin="0px 0px 0px 0px"
						sm-padding="0px 0px 400px 0px"
					/>
				</Box>
				<Box width="50%" display="flex" padding="16px 16px 0px 16px" lg-width="100%">
					<Box
						padding="98px 64px 98px 64px"
						mix-blend-mode="lighten"
						background="--color-red"
						margin="36px 0px -20px -112px"
						display="flex"
						flex-direction="column"
						color="--light"
						lg-margin="0px 0px 0px 0px"
						lg-width="100%"
						sm-padding="64px 32px 64px 32px"
					>
						<Structure display="grid" width="auto">
							<Override slot="Content">
								<Override slot="cell-0">
									<Text margin="0px 0px 0px 0px">
										Some text
									</Text>
								</Override>
								<Override slot="cell-1">
									<Input display="block" placeholder-color="LightGray" background="white" />
								</Override>
								<Override slot="cell-2">
									<Text margin="0px 0px 0px 0px">
										Some text
									</Text>
								</Override>
								<Override slot="cell-3">
									<Input display="block" placeholder-color="LightGray" background="white" />
								</Override>
							</Override>
						</Structure>
						<Text
							as="h4"
							margin="0"
							font="--base"
							letter-spacing="1px"
							text-transform="uppercase"
						>
							About me
						</Text>
						<Text as="p" margin="16px 0" font="--base" max-width="400px">
							d
						</Text>
					</Box>
				</Box>
			</Box>
		</Section>
		<Section background-color="--dark" text-align="center" padding="32px 0" quarkly-title="Footer-1">
			<List
				margin="0px 0px 0px 0px"
				padding="12px 0px 12px 0px"
				list-style-type="none"
				as="ul"
				display="flex"
				align-items="center"
				justify-content="center"
			>
				<Link
					href="#"
					color="white"
					padding="6px 12px 6px 12px"
					text-decoration-line="initial"
					display="flex"
					font="20px/30px sans-serif"
					hover-color="--lightD2"
					transition="background-color 0.1s ease 0s"
				>
					About
				</Link>
				<Link
					href="#"
					color="white"
					padding="6px 12px 6px 12px"
					text-decoration-line="initial"
					display="flex"
					font="20px/30px sans-serif"
					hover-color="--lightD2"
					transition="background-color 0.1s ease 0s"
				>
					Services
				</Link>
				<Link
					href="#"
					color="white"
					padding="6px 12px 6px 12px"
					text-decoration-line="initial"
					display="flex"
					font="20px/30px sans-serif"
					hover-color="--lightD2"
					transition="background-color 0.1s ease 0s"
				>
					Contacts
				</Link>
			</List>
			<Link
				href="mailto:hello@company.com"
				text-decoration-line="none"
				variant="--base"
				color="--grey"
				hover-color="--primary"
			>
				hello@company.com
			</Link>
		</Section>
		<Box min-width="100px" min-height="100px" position="fixed" />
		<Link
			font={"--capture"}
			font-size={"10px"}
			position={"fixed"}
			bottom={"12px"}
			right={"12px"}
			z-index={"4"}
			border-radius={"4px"}
			padding={"5px 12px 4px"}
			background-color={"--dark"}
			opacity={"0.6"}
			hover-opacity={"1"}
			color={"--light"}
			cursor={"pointer"}
			transition={"--opacityOut"}
			quarkly-title={"Badge"}
			text-decoration-line={"initial"}
			href={"https://quarkly.io/"}
			target={"_blank"}
		>
			Made on Quarkly
		</Link>
		<RawHtml>
			<style place={"endOfHead"} rawKey={"6495169491dc65001840fcad"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>;
});