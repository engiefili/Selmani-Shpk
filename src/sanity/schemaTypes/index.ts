import type { SchemaTypeDefinition } from "sanity";

import aboutPage from "./documents/aboutPage";
import contactPage from "./documents/contactPage";
import homePage from "./documents/homePage";
import industriesPage from "./documents/industriesPage";
import projectsPage from "./documents/projectsPage";
import service from "./documents/service";
import siteSettings from "./documents/siteSettings";
import {
  aboutHeroSection,
  aboutValueItem,
  clientsGridSection,
  commitmentGridSection,
  commitmentItem,
  servicesBandBullet,
  servicesBandSection,
  valuesGridSection,
} from "./objects/aboutPageSections";
import {
  accordionGroupBlock,
  featureGridBlock,
  linkListBlock,
  textBlock,
} from "./objects/contentBlocks";
import featureItem from "./objects/featureItem";
import { industrySectionItem } from "./objects/industriesPageSections";
import { projectImageGroup, projectServiceTab } from "./objects/projectsPageSections";
import {
  footerCatalogLink,
  navDropdownItem,
  navLinkItem,
} from "./objects/siteSettingsSections";
import {
  aboutUsSection,
  benefitItem,
  certificationBadge,
  heroSection,
  heroSlide,
  homeProcessSection,
  homeProcessStep,
  hotDipHomeSection,
  keyFiguresSection,
  metallicConstructionsSection,
  metallicShowcaseItem,
  tankItem,
  tanksShowcaseSection,
} from "./objects/homePageSections";
import processSteps from "./objects/processSteps";
import serviceTab from "./objects/serviceTab";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    homePage,
    aboutPage,
    industriesPage,
    projectsPage,
    service,
    siteSettings,
    contactPage,
    // Service section objects
    serviceTab,
    processSteps,
    featureItem,
    textBlock,
    featureGridBlock,
    linkListBlock,
    accordionGroupBlock,
    // Home page objects
    heroSection,
    heroSlide,
    certificationBadge,
    aboutUsSection,
    hotDipHomeSection,
    benefitItem,
    metallicConstructionsSection,
    metallicShowcaseItem,
    keyFiguresSection,
    homeProcessSection,
    homeProcessStep,
    tanksShowcaseSection,
    tankItem,
    // About page objects
    aboutHeroSection,
    aboutValueItem,
    valuesGridSection,
    servicesBandBullet,
    servicesBandSection,
    clientsGridSection,
    commitmentItem,
    commitmentGridSection,
    // Industries page objects
    industrySectionItem,
    // Projects page objects
    projectImageGroup,
    projectServiceTab,
    // Site settings objects
    navDropdownItem,
    navLinkItem,
    footerCatalogLink,
  ],
};
