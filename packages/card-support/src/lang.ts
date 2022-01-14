import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ERROR_OCCURRED = i18n.t(`An error occurred`, { ns: namespace });
  lang.DOWNLOAD_CLIENT_DATA = i18n.t(`Download Client Data`, { ns: namespace });
  lang.CLIENT_LOCATION = i18n.t(`Client Location`, { ns: namespace });
  lang.ALL_LOCATIONS = i18n.t(`All Locations`, { ns: namespace });
  lang.CARD_STATUS = i18n.t(`Card Status`, { ns: namespace });
  lang.NEEDS_CARD = i18n.t(`Needs Card`, { ns: namespace });
  lang.CARD_NOT_NEEDED = i18n.t(`Card not needed`, { ns: namespace });
  lang.BOTH_NEEDS_CARD_CARD_NOT_NEEDED = i18n.t(`Both "Needs card" and "Card not needed"`, {
    ns: namespace,
  });
  lang.CARD_ORDER_DATE = i18n.t(`Card Order Date`, { ns: namespace });
  lang.CARD_ORDER_DATE_REQUIRED = i18n.t(`Please enter start date and end date`, { ns: namespace });
  lang.SELECT_CARD_ORDER_DATE = i18n.t(`Select Card Order Date`, { ns: namespace });
  lang.DOWNLOADING = i18n.t(`Downloading`, { ns: namespace });
  lang.DOWNLOAD_CSV = i18n.t(`Download CSV`, { ns: namespace });
  lang.NO_DATA_FOUND = i18n.t(`No data found`, { ns: namespace });
  lang.USER_NOT_ACTIVE_PRACTITIONER = i18n.t(`check if logged in user is an active practitioner`, {
    ns: namespace,
  });
  lang.USER_NOT_ASSIGNED = i18n.t(`check if user is assigned to any active teams`, {
    ns: namespace,
  });
  lang.USERS_TEAM_NOT_ASSIGNED = i18n.t(`check if user's team is assigned to any locations`, {
    ns: namespace,
  });
  lang.USER_NOT_ASSIGNED_AND_USERS_TEAM_NOT_ASSIGNED = i18n.t(
    `Please confirm that the logged-in user is assigned to a team and the team is assigned to a location, otherwise contact system admin.`,
    {
      ns: namespace,
    }
  );
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
