import React, { memo, useMemo } from 'react';

import { useIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';

import { ProfileCardSection } from '../../../../commons/profile_card/profile_card_section/profile_card_section';
import { ProfileCardSectionTitle } from '../../../../commons/profile_card/profile_card_section_title/profile_card_section_title';
import { ProfileCardSectionText } from '../../../../commons/profile_card/profile_card_section_text/profile_card_section_text';
import { ProfileCardAnimatedBack } from '../../../../commons/profile_card/profile_card_animated_back/profile_card_animated_back';
import { ProfileCardSectionSubtitle } from '../../../../commons/profile_card/profile_card_section_subtitle/profile_card_section_subtitle';

import { styles } from './experiences_back_styles';
import { translations } from './experiences_translations';
import { useAdditionalNodes } from '../../../../hooks/use_additional_nodes';
import { existsAndNotEmpty } from '../../../utils/exists_and_not_empty';
import { NoWork } from './no_work/no_work';

const useStyles = createUseStyles(styles);

const ExperienceContent = ({ experience, variant, classes }) => {
    const { formatMessage } = useIntl();
    const [buildTitle] = useAdditionalNodes('cards.experiences.back.experience.content.buildTitle', null);

    const { id, name, summary, place, position } = experience;
    const dateString = useMemo(() => {
        if (!experience.endDate) {
            if (!experience.startDate) {
                return '';
            }
            return formatMessage(translations.since, { year: experience.startDate.format('MMM YYYY') });
        }
        const startDate = experience.startDate.isValid() ? experience.startDate.format('MMM YYYY') : '';
        const endDate = experience.endDate.isValid() ? experience.startDate.format('MMM YYYY') : '';
        return `${startDate} - ${endDate}`;
    }, [experience]);

    const title = useMemo(() => {
        if (typeof buildTitle === 'function') {
            return buildTitle({ experience });
        }
        const builder = [];
        if (name) {
            builder.push(name);
        }
        if (place?.name) {
            if (builder.length) {
                builder.push(' - ');
            }
            builder.push(place.name);
        }
        if (builder.length) {
            builder.push(<br />);
        }
        builder.push(dateString);
        return builder;
    }, [buildTitle, experience]);
    return (
        <ProfileCardSection key={id} cardVariant={variant}>
            <ProfileCardSectionTitle>{position}</ProfileCardSectionTitle>
            <ProfileCardSectionSubtitle customClasses={{ container: classes.subtitle }}>
                {title}
            </ProfileCardSectionSubtitle>
            <ProfileCardSectionText>{summary}</ProfileCardSectionText>
        </ProfileCardSection>
    );
};

const Content = ({ data, handleAddButtonClick, classes }) => {
    const hasWork = useMemo(() => existsAndNotEmpty(data?.work), [data]);
    const experiences = data.work?.filter(({ position, summary }) => Boolean(position && summary));

    if (!hasWork) {
        return <NoWork {...{ handleAddButtonClick }} />;
    }
    return experiences.map(experience => (
        <ExperienceContent key={`work_experience_${experience.id}`} experience={experience} classes={classes} />
    ));
};

const ExperiencesBackComponent = ({ data, handleAddButtonClick }) => {
    const classes = useStyles();
    return (
        <ProfileCardAnimatedBack title="Experiences">
            <Content {...{ data, handleAddButtonClick, classes }} />
        </ProfileCardAnimatedBack>
    );
};

export const ExperiencesBack = memo(ExperiencesBackComponent);
