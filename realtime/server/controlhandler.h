#ifndef CONTROLHANDLER_H
#define CONTROLHANDLER_H

#include "jsonhandler.h"

class ControlHandler : public JsonHandler
{
public:
    enum OperationType
    {
        StartExperiment,
        ResumeExperiment,
        StopExperiment
    };

    ControlHandler(OperationType operation);

protected:
    void processData(const boost::property_tree::ptree &requestPt, boost::property_tree::ptree &responsePt);

private:
    OperationType _operation;
};

#endif // CONTROLHANDLER_H
