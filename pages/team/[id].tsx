import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import styles from '../../styles/Team.module.scss';
import { ITeam } from '..';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export interface IPlayer {
    id: number;
    name: string;
    nationality: string;
    position: string;
    shirtNumber: number;
}

const fetchTeam = async (id: string) => {
    const res = await fetch(`https://api.football-data.org/v2/teams/${id}`, {
        headers: {
            'X-Auth-Token': `${apiKey}`,
        },
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

export default function TeamPage(): React.ReactNode {
    const router = useRouter();
    const { id } = router.query;

    const { isLoading, error, data } = useQuery(['team', id], () => fetchTeam(id as string), {
        staleTime: Infinity,
        enabled: !!id,
    });

    const team: ITeam = data;
    console.log(data);

    return (
        <div>
            <Head>
                <title>Football API</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>Team Page</h1>

                {isLoading && 'Loading...'}
                {error && 'An error has occurred: ' + (error as Error).message}

                {team && (
                    <>
                        <div>
                            <Image
                                width={80}
                                height={`auto`}
                                className={styles.crest}
                                src={team.crestUrl}
                                alt={team.shortName}
                            />
                        </div>

                        <h2>{team.shortName}</h2>
                        <p>{`Founded ${team.founded}`}</p>
                        <p>{`Plays at ${team.venue}`}</p>

                        <h2>Squad</h2>
                        <div>
                            {team.squad?.map((player) => (
                                <div key={player.id} className={styles.player}>
                                    <p>{player.shirtNumber || '?'}</p>
                                    <p>{player.name}</p>
                                    <p>{player.position}</p>
                                    <p>{player.nationality}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
