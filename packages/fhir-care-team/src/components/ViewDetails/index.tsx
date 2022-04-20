import React from 'react';
import { Col, Space, Spin, Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { useQuery, useQueries } from 'react-query';
import { IfhirR4 } from '@smile-cdr/fhirts';
import {
  Resource404,
  BrokenPage,
  FHIRServiceClass,
  getObjLike,
  IdentifierUseCodes,
} from '@opensrp/react-utils';
import lang from '../../lang';
import { careTeamResourceType, FHIR_CARE_TEAM, URL_CARE_TEAM } from '../../constants';
import { getPatientName } from '../CreateEditCareTeam/utils';
import { FHIR_GROUPS, FHIR_PRACTITIONERS } from '../../constants';
import { Identifier } from '@smile-cdr/fhirts/dist/FHIR-R3';
const { Text } = Typography;

/** typings for the view details component */
export interface ViewDetailsProps {
  careTeamId: string;
  fhirBaseURL: string;
}

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { careTeamId, fhirBaseURL } = props;
  const history = useHistory();

  const { data, isLoading, error } = useQuery({
    queryKey: [careTeamResourceType, careTeamId],
    queryFn: () =>
      careTeamId ? new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM).read(careTeamId) : undefined,
    select: (res) => res,
  });

  const practitioners = useQueries(
    data && data.participant
      ? data.participant.map((p: { member: { reference: string } }) => {
          return {
            queryKey: [FHIR_CARE_TEAM, p.member.reference],
            queryFn: () =>
              new FHIRServiceClass(fhirBaseURL, FHIR_PRACTITIONERS).read(
                p.member.reference.split('/')[1]
              ),
            // Todo : useQueries doesn't support select or types yet https://github.com/tannerlinsley/react-query/pull/1527
            select: (res: IfhirR4.IPractitioner) => res,
          };
        })
      : []
  );

  const subject = useQuery({
    queryKey: [FHIR_GROUPS, data?.subject?.reference],
    queryFn: () =>
      data?.subject?.reference
        ? new FHIRServiceClass(fhirBaseURL, FHIR_GROUPS).read(data.subject.reference.split('/')[1])
        : undefined,
    select: (res) => res,
  });

  if (!careTeamId) {
    return null;
  }

  if (error) {
    return <BrokenPage errorMessage={`${error}`} />;
  }

  const officialIdentifier = getObjLike(data?.identifier, 'use', IdentifierUseCodes.OFFICIAL)[0] as
    | Identifier
    | undefined;

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => history.push(URL_CARE_TEAM)}
        />
      </div>
      {isLoading ? (
        <Spin size="large" className="custom-spinner" />
      ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !isLoading && careTeamId && !data ? (
        <Resource404 />
      ) : (
        <Space direction="vertical">
          <Text strong={true} className="display-block">
            {lang.NAME}
          </Text>
          <Text type="secondary" className="display-block">
            {data?.name}
          </Text>
          <Text strong={true} className="display-block">
            {lang.IDENTIFIER}
          </Text>
          <Text type="secondary" className="display-block">
            {officialIdentifier?.value}
          </Text>
          <Text strong={true} className="display-block">
            {lang.STATUS}
          </Text>
          <Text type="secondary" className="display-block">
            {data?.status}
          </Text>
          {subject.data && subject.data.name ? (
            <>
              <Text strong={true} className="display-block">
                {lang.SUBJECT}
              </Text>
              <Text type="secondary" className="display-block">
                {subject.data.name}
              </Text>
            </>
          ) : (
            ''
          )}
          <Text strong={true} className="display-block">
            {lang.PARTICIPANTS}
          </Text>
          {practitioners.length
            ? practitioners.map((datum: Dictionary) => (
                <>
                  <Text type="secondary" className="display-block">
                    {getPatientName(datum.data)}
                  </Text>
                </>
              ))
            : ''}
        </Space>
      )}
    </Col>
  );
};

export { ViewDetails };
