import ping from "ping";
import cron from "node-cron";
import chalk from "chalk";
import network from "network";

console.log("PINGING... ");
const url = "lol.garena.com";

function colorizeRemote(latency: number | string) {
	return () => {
		let color = chalk.red;
		if (latency < 90) {
			color = chalk.green;
		} else if (latency <= 100) {
			color = chalk.yellow;
		} else if (latency <= 120) {
			color = chalk.hex("#ffa500");
		}
		if (!(latency >= 0)) {
			return chalk.white.bgRed(" Timed out ");
		}
		return color.bold(` ${latency}`) + color.grey(" ms");
	};
}
function colorizeLocal(latency: number | string) {
	return () => {
		let color = chalk.red;
		if (latency < 1) {
			color = chalk.green;
		} else if (latency <= 10) {
			color = chalk.hex("#ffa500");
		}

		return color.bold(latency);
	};
}

let defaultGateway: any;
network.get_gateway_ip(function (err: any, ip: any) {
	console.log("Your Router IP", err || ip); // should return your public IP address

	defaultGateway = ip;
});
const pingService = cron.schedule("* * * * * *", async () => {
	Promise.all([ping.promise.probe(url), ping.promise.probe(defaultGateway)])
		.then((res) => {
			console.log(
				`Pinging ${url} ${colorizeRemote(
					Number(Number(res[0].avg).toFixed(0))
				)()}. Gateway (${defaultGateway}) ${colorizeRemote(
					Number(Number(res[1].avg).toFixed(0))
				)()}  `
			);
		})
		.catch((err) => console.log(err));
});
