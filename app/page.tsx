import { isToday, setHours } from "date-fns";
import { Fragment } from "next/dist/server/app-render/entry-base";
import Image from "next/image";
import vulvaVLogo from "../public/vulvatorious_v_logo.png";
import { Songkick } from "./songkick";

export default async function Home() {
  const nextShowsList: Songkick.Event[] | undefined = await fetch(
    `https://api.songkick.com/api/3.0/artists/10189431-vulvatorious/calendar.json?apikey=${process.env.SONGKICK_APIKEY}`,
    { next: { revalidate: 12000 } },
  )
    .then((res) => res.json())
    .then((res) => res.resultsPage?.results?.event);
  const nextShowsWithTicketLink = nextShowsList?.[0]?.uri
    ? await Promise.all(
        nextShowsList.map((show) =>
          Promise.all([
            fetch(
              `https://api.songkick.com/api/3.0/events/${show.id}.json?apikey=${process.env.SONGKICK_APIKEY}`,
              { next: { revalidate: 12000 } },
            )
              .then((res) => res.json())
              .then(
                (res) =>
                  res.resultsPage?.results?.event as
                    | Songkick.EventDetails
                    | undefined,
              ),
            fetch(show.uri, { next: { revalidate: 12000 } })
              .then((r) => r.text())
              .then((html) => {
                const path = html.match(/(\/tickets\/[0-9]+\?)/)?.[1];
                return path
                  ? new URL(path, "https://www.songkick.com").href
                  : null;
              }),
          ]),
        ),
      )
    : [];

  return (
    <div className="flex flex-row-reverse flex-1 items-center justify-evenly flex-wrap">
      <div
        className="relative w-[75vw] max-w-100"
        style={{ aspectRatio: `${vulvaVLogo.width} / ${vulvaVLogo.height}` }}
      >
        <Image
          src={vulvaVLogo.src}
          alt=""
          width={vulvaVLogo.width}
          height={vulvaVLogo.height}
          style={{ filter: "blur(60px)", width: "100%", height: "auto" }}
          className="absolute inset-0"
        />
        <Image
          src={vulvaVLogo.src}
          alt=""
          width={vulvaVLogo.width}
          height={vulvaVLogo.height}
          style={{ filter: "blur(30px)", width: "100%", height: "auto" }}
          className="absolute inset-0"
        />
        <Image
          src={vulvaVLogo.src}
          alt=""
          width={vulvaVLogo.width}
          height={vulvaVLogo.height}
          style={{ filter: "invert(1)", width: "100%", height: "auto" }}
          className="absolute inset-0"
        />
      </div>
      {nextShowsWithTicketLink.length ? (
        <center
          className="text-3xl my-[4vh] flex-col flex gap-8"
          style={{
            textShadow:
              "0 0 2.5vh rgba(0, 0, 0, 1), 0 0 2.5vw rgba(0, 0, 0, 1)",
          }}
        >
          {nextShowsWithTicketLink.map(([nextShow, ticketLink]) =>
            nextShow ? (
              <div key={nextShow.id} className="flex flex-col">
                <a target="_blank" href={nextShow.uri} className="text-6xl">
                  <time
                    title={`${nextShow.start.date}  ${nextShow.start.time}`}
                    dateTime={nextShow.start.datetime}
                  >
                    {isToday(new Date(nextShow.start.datetime)) ? (
                      <>today</>
                    ) : (
                      new Date(
                        nextShow.start.datetime ||
                          setHours(new Date(nextShow.start.date), 16) ||
                          "",
                      ).toLocaleDateString("da")
                    )}
                  </time>
                </a>
                <a
                  className="text-3xl leading-none"
                  target="_blank"
                  href={
                    nextShow.venue?.website ||
                    `https://maps.google.com/maps?q=${
                      (nextShow.venue && nextShow.venue.displayName) ||
                      nextShow.location.city
                    }`
                  }
                >
                  <span>
                    {nextShow.series?.displayName ||
                      (nextShow.venue.id && nextShow.venue.displayName) ||
                      nextShow.location.city}
                  </span>
                  {(nextShow.series?.displayName ||
                    (nextShow.venue.id && nextShow.venue.displayName)) &&
                  !String(
                    nextShow.series?.displayName ||
                      (nextShow.venue.id && nextShow.venue.displayName),
                  ).includes(nextShow.venue.city.displayName) ? (
                    <>, {nextShow.venue.city.displayName}</>
                  ) : null}
                </a>
                {nextShow.performance.length > 1 &&
                nextShow.performance.some(
                  (p) => p.displayName !== "Vulvatorious",
                ) &&
                !nextShow.series?.displayName.includes("Festival") ? (
                  <div className="text-lg leading-none">
                    with{" "}
                    <span>
                      {nextShow.performance
                        .filter((p) => p.displayName !== "Vulvatorious")
                        .map((p, i, arr) => (
                          <Fragment key={p.artist.id}>
                            {i === arr.length - 1 && arr.length > 1 ? (
                              <> and </>
                            ) : i ? (
                              <>, </>
                            ) : null}
                            <a target="_blank" href={p.artist.uri}>
                              {p.displayName.replace(" (DK)", "")}
                            </a>
                          </Fragment>
                        ))}
                    </span>
                  </div>
                ) : null}
                {ticketLink ? (
                  <a
                    target="_blank"
                    className="leading-none"
                    href={ticketLink}
                    style={{ fontSize: "1.25em" }}
                  >
                    Get tickets
                  </a>
                ) : null}
              </div>
            ) : null,
          )}
        </center>
      ) : null}
    </div>
  );
}
