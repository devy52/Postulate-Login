import React from "react";
import theme from "theme";
import { Theme, Link, Text, List, Box, Section } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml } from "@quarkly/components";
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
		<Section background="url(https://wallpaperaccess.com/full/1905877.jpg) 20% 15%/cover" padding="60px 0" sm-padding="40px 0" height="556px" />
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
		<RawHtml>
			<style place={"endOfHead"} rawKey={"6495169491dc65001840fcad"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>;
});
